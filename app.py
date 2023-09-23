import os
import secrets
from flask import Flask, redirect, render_template, jsonify, request, session
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from datetime import datetime
from werkzeug.security import check_password_hash, generate_password_hash

#import helpers (this is from the CS50 HTML project)
from helpers import apology, login_required

#generate a secret key for flask
secret_key = secrets.token_hex(32)

app = Flask(__name__)
app.secret_key = secret_key

#SQLAlchemy databse URI
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///neobase.db"
db = SQLAlchemy(app)

#set up my models for the database
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    hash = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    signupMonth = db.Column(db.Integer, nullable=False)
    signupDay = db.Column(db.Integer, nullable=False)
    signupYear = db.Column(db.Integer, nullable=False)
    np = db.Column(db.Integer, default=0)


class Pets(db.Model):
    pet_id = db.Column(db.Integer, primary_key=True)
    id = db.Column(db.Integer, nullable=False)
    active = db.Column(db.Integer, nullable=False)
    pettype = db.Column(db.String(80), nullable=False)
    petname = db.Column(db.String(80), nullable=False)
    petcolor = db.Column(db.String(80), nullable=False)
    hunger = db.Column(db.Integer, nullable=False)
    hp = db.Column(db.Integer, nullable=False)
    currenthp = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())
    username = db.Column(
        db.String(80), db.ForeignKey("users.username"), nullable=False
    )  # Create a foreign key relationship
    user = db.relationship("Users", backref="Pets")


class User_items(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey("items.item_id"), nullable=True)
    user_item_name = db.Column(db.String(80), unique=True, nullable=True)
    item_value = db.Column(db.Integer, nullable=True)
    item_use = db.Column(db.String(80), nullable=True)
    username = db.Column(db.String(80), db.ForeignKey("users.username"), nullable=True)
    user = db.relationship("Users", backref="user_items")
    items = db.relationship("items", backref="user_items")


class items(db.Model):
    item_id = db.Column(db.Integer, primary_key=True)
    item_value = db.Column(db.Integer, nullable=False)
    item_use = db.Column(db.String(80), nullable=False)
    item_name = db.Column(db.String(80), nullable=False)


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        password1 = request.form.get("password1")
        signupMonth = request.form.get("signupMonth")
        signupDay = request.form.get("signupDay")
        signupYear = request.form.get("signupYear")
        email = request.form.get("email")
        email1 = request.form.get("email1")

        if not username or not password or not email:
            return apology("must provide all information", 400)
        if password != password1:
            return apology("passwords do not match", 400)

        if email != email1:
            return apology("emails do not match", 400)

        existing_username = Users.query.filter_by(username=username).first()
        if existing_username:
            return apology("username already exists", 400)

        existing_email = Users.query.filter_by(email=email).first()
        if existing_email:
            return apology("this email is already in use", 400)

        hashpass = generate_password_hash(password)
        signupDay = generate_password_hash(signupDay)
        signupMonth = generate_password_hash(signupMonth)
        signupYear = generate_password_hash(signupYear)
        email = generate_password_hash(email)

        new_user = Users(
            username=username,
            hash=hashpass,
            signupMonth=signupMonth,
            signupDay=signupDay,
            signupYear=signupYear,
            email=email,
        )
        db.session.add(new_user)
        db.session.commit()
        generated_id = new_user.id

        # new_pet_prep = Pets(id=generated_id, username=username,pettype=None, petname=None, petcolor=None, hunger=1, hp=10, currenthp=10)
        # db.session.add(new_pet_prep)
        # db.session.commit()
        return redirect("/login")
    else:
        return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    session.pop("user_id", None)

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        user = Users.query.filter_by(username=username).first()

        if not user or not check_password_hash(user.hash, password):
            return apology("invalid username and/or password", 400)

        session["user_id"] = user.id
        session["user_username"] = user.username

        return redirect("/")
    elif request.method == "GET":
        return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


@app.route("/fruitmachine", methods=["POST", "GET"])
@login_required
def fruitmachine():
    request.method == "GET"
    username = session.get("user_username")
    if username is not None:
        user = Users.query.filter_by(username=username).first()
        pets = Pets.query.filter_by(username=username, active=1).all()
        return render_template("fruitmachine.html", user=user, pets=pets)


@app.route("/update_prize", methods=["POST"])
def update_prize():
    data = request.get_json()
    prize_value = data.get("prizeValue")
    prize_item = data.get("prizeItem")

    user_id = session.get("user_id")
    username = session.get("user_username")

    if user_id is not None:
        user = Users.query.get(user_id)

        if user is not None:
            # Update user's np
            user.np += prize_value

            item = items.query.filter_by(item_name=prize_item).first()
            if item:
                new_item = User_items(
                    item_id=item.item_id,
                    username=username,
                    user_item_name=prize_item,
                    item_value=item.item_value,
                    item_use=item.item_use,
                )
                db.session.add(new_item)

            db.session.commit()
            return jsonify({"message": "Prize value updated successfully"})

    return jsonify({"error": "Invalid request or user not found"}), 400


@app.route("/current_np", methods=["POST"])
def current_np():
    user_id = session.get("user_id")
    username = session.get("user_username")
    if user_id is not None:
        user = Users.query.filter_by(username=username).first()

        if user is not None:
            np = user.np
            username = user.username 
            return render_template(
                "your_template.html", np=np, username=username, user=user
            )


@app.route("/games")
def games():
    username = session.get("user_username")
    if username is not None:
        user = Users.query.filter_by(username=username).first()
        pets = Pets.query.filter_by(username=username, active=1).all()
        return render_template("games.html", user=user, pets=pets)
    else:
        return render_template("games.html")


@app.route("/createapet", methods=["GET", "POST"])
@login_required
def createapet():
    if request.method == "POST":
        username = session.get("user_username")
        userid = session.get("user_id")

        if username is not None:
            # Use SQLAlchemy to check if the user has at least one pet with a non-empty pettype
            pet_count = (
                db.session.query(func.count(Pets.id))
                .filter_by(username=username)
                .scalar()
            )

            if pet_count < 4:
                pet_ready = True
            else:
                pet_ready = False

            if pet_ready == True:
                # User has a pet with a non-empty pettype
                # get pet name and pet color and pet type then add to db pet ready
                pettype = request.form.get("pettype")
                petcolor = request.form.get("petcolor")
                petname = request.form.get("petname")

                pet_active = (
                    db.session.query(func.count(Pets.id))
                    .filter(Pets.username == username, Pets.active == True)
                    .scalar()
                )

                if pet_active == True:
                    active = 0
                else:
                    active = 1

                if not petname or not pettype or not petcolor:
                    return apology("Must fill out all pet info", 400)
                update_first_pet = Pets(
                    id=userid,
                    username=username,
                    pettype=pettype,
                    petname=petname,
                    petcolor=petcolor,
                    active=active,
                    hunger=1,
                    hp=10,
                    currenthp=10,
                )
                db.session.add(update_first_pet)
                db.session.commit()
                return redirect("/mypets")
            else:
                return redirect("/mypets")

        else:
            return render_template("apology.html")

    elif request.method == "GET":
        username = session.get("user_username")
        user = Users.query.filter_by(username=username).first()
        pets = Pets.query.filter_by(username=username, active=1).all()

        return render_template("createapet.html", user=user, pets=pets)


@app.route("/mypets", methods=["POST", "GET"])
@login_required
def mypets():
    username = session.get("user_username")

    if request.method == "POST":
        if username is not None:
            # Get the pet_id from the form data
            pet_id = request.form.get("pet_id")

            # Update all pets of the user to set active=0
            Pets.query.filter_by(username=username).update({"active": 0})

            # Set the active pet's active column to 1
            new_active_pet = Pets.query.filter_by(
                username=username, pet_id=pet_id
            ).first()
            if new_active_pet:
                new_active_pet.active = 1
                db.session.add(new_active_pet)
                db.session.commit()

            # Redirect to the mypets page
            return redirect("/mypets")

    elif request.method == "GET":
        if username is not None:
            has_pet = (
                db.session.query(Pets)
                .filter_by(username=username)
                .filter(Pets.pettype.isnot(None))
                .first()
            )
            if has_pet:
                user = Users.query.filter_by(username=username).first()
                pets = Pets.query.filter_by(username=username, active=1).all()
                pets_all = Pets.query.filter_by(username=username).all()
                return render_template(
                    "mypets.html", user=user, pets=pets, pets_all=pets_all
                )

    return render_template("apology.html")


@app.route("/inventory", methods=["POST", "GET"])
@login_required
def inventory():
    username = session.get("user_username")

    if request.method == "POST":
        input = request.form.get("inventoryAction").split("|")
        action = input[0]  # First part
        pet_name = input[1] #Second part
        item_id = request.form.get("item_id")

        if action is not None and item_id is not None:
            print("Item ID:", item_id)
            print("FORM ACTION:", action)
            print("Pet Name:", pet_name)
            print("username:", username)

            if action == "Feed to":
                deleteitem = User_items.query.get(item_id)
                pets = Pets.query.filter_by(username=username, petname=pet_name).first()

                if deleteitem:
                    db.session.delete(deleteitem)
                    pets.hunger += 1
                    db.session.commit()
                    return redirect("/inventory")

            if action == "Use on":
                deleteitem = User_items.query.get(item_id)
                pets = Pets.query.filter_by(username=username, petname=pet_name).first()

                if deleteitem:
                    db.session.delete(deleteitem)
                    item_name = deleteitem.user_item_name
                    print("item name:", item_name)

                    if item_name is not None:
                        item_parts = item_name.split()
                        item_parts = [item_part.lower() for item_part in item_parts]

                        if item_parts[2] == "brush" and item_parts[1] == "paint":
                            print("color:", item_parts[0])
                            new_color = item_parts[0]
                            print("color:", new_color)
                            print("old Color", pets.petcolor)

                            pets.petcolor = new_color
                            db.session.commit()
                            return redirect("/inventory")

            elif action == "delete":
                deleteitem = User_items.query.get(item_id)
                if deleteitem:
                    db.session.delete(deleteitem)
                    db.session.commit()
                    return redirect("/inventory")

        return redirect("/inventory")

    elif request.method == "GET":
        if username is not None:
            has_pet = (
                db.session.query(Pets)
                .filter_by(username=username)
                .filter(Pets.pettype.isnot(None))
                .first()
            )
            if has_pet:
                user = Users.query.filter_by(username=username).first()
                pets_all = Pets.query.filter_by(username=username).all()
                pets = Pets.query.filter_by(username=username, active=1).all()
                items_all = User_items.query.filter_by(username=username).all()

                return render_template(
                    "inventory.html",
                    user=user,
                    pets=pets,
                    pets_all=pets_all,
                    items_all=items_all,
                )

    return render_template("apology.html")


@app.route("/")
def index():
    username = session.get("user_username")
    if username is not None:
        user = Users.query.filter_by(username=username).first()
        pets = Pets.query.filter_by(username=username, active=1).all()
        return render_template("home.html", user=user, pets=pets)
    else:
        return render_template("home.html")


if __name__ == "__main__":
    # if hosting as a real site I should store as a dedicated session storage, Redis or database (I have read)
    app.config["SESSION_TYPE"] = "filesystem"
    Session(app)
    app.run(debug=True)
