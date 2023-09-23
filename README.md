# NEO
#### Video Demo:  <https://youtu.be/pRfxjKfJ2V4>
#### Description: 
Idea for my project:
I wanted to create a project that let me recreate neopets.com or at least parts of it. Neopets was what got me interested in HTML and CSS when I was a child and I think it was really important to a lot of people today. The site has issues but I feel like its high art of the "old internet" in some forms due to the complexity of the site. I wanted to make it look like a modernized version of the old site with a permanent sidebar and old-styled icons I created most of the icons and banners however there are a handful of assets that I took from the Neopets website however I did not take any code from the site. Bootstrap 5.3 documentation was so essential to my project as well and I feel like this course made me feel more comfortable reading documentation to find what I needed.

I will go through my HTML pages and each app.py function by the pages that post to them.

login.html
I created a background layout along with a media view, i did this throughout the site because I felt it would make it easier to add different widths later and would look a bit more modern as well as being able to flex for mobile devices which I did create implementation for but forgot to feature in my video.

register.html
For this page i just created a form that submitted to the app.py with the information and stored it within my database for login and register I took huge inspiration from the project with stocks from the cs50 course

layout.html
The layout page was a huge amount of work as I planned I had to import bootstrap, fonts, my style.css and more into it and make sure it would be a good layout. I also created my sidebar here, I made custom icons and chose to use an on-mouseover, to use js to update the image when it’s being hovered over, and I ended up using this type of layout for a lot of the sites buttons. I also added some dynamic code that checks if there is a "user" if there is a user then it displays their NP or neopoints and the username, if there is not a user it displays "login" i never got around to adding this feature to the mobile view. I also added the bootstrap rows and columns to hold my content.

fruitmachine.html & fruitmachine.js
I spent by far the longest on this I read so many articles on JS, I have a minor in computer information systems and so I had some college experience and professional experience writing HTML and JS but boy this took me a long time to figure out.  I load in images, for the fruit, then spin the columns then get the background url of the final column display then split that to get the something that I can compare to then feed out rewards and messages. I also made something that stores if you have spun the wheel on a specific day as it is a once a day free spin however it stores it locally so if you clear your cookies you can spin again this was something that I never got around to fixing I deemed it not worth the time because it does in fact work.

createapet.html
This was a challenge as I had to update my databases several times while creating this it is really just a form that posts to the app.py but boy did it take a minute to create. I checks if you have less than 4 pets that’s my limit I put on the pets but really I could change that to anything. It also checks if you already have a pet or not. Although that really is just to set it as an "active" pet if you don’t have one automatically Its also leftover from when I was initializing some of the database when a user created an account but I decided that was bad practice. It leads you to the mypets page.

mypets.html
For mypets I wanted to have any pets you have display so I used a dynamic tags to define a loop. It checks through my pets_all so it always displays all the users pets. (If they have pets) if the user submits the active form it changes the active pet to the currently selected pet.

inventory.html
Inventory was rough. I was able to reuse some of my code from the mypets which was similar due to iterating through all items from the database that belong to a user. however it was challenging because I had to learn how to use Modals to create popups and then figure out how to dynamically display petnames(as you can have up to four) as well as setting an action that the item can take. I also wanted to have a system that I could use to add more item types to in the future. I created food which when selected it returns the pet name and the "action" which is "Feed to" and then the code to update the database for the pet to up hunger. Similarly with the paint brush its action is "Use on" however I specified further in that code that if the item name is split and the last 2 parts are paint and brush then I can change the color to the first part of the paint brush item name "Plushie paint brush" or "Red paint brush" this is to future proof any colors I want to add and make it so if I made an Item that wasn’t a brush it wouldn’t change a color.

home.html
Just my / page it has just a short blurb and not much content

games.html
The games directory not much to say as I only made one game in my 3 week time period but in the future I could add more which was one of my big goals with this project.

Styles.CSS
My styles sheet was gradually build over the course of the site and I’m pretty proud of it I did reference some W3Schools documentation as well as Mozilla developer docs for some of the features I wanted to implement but didn’t know how to.
#   N e o  
 