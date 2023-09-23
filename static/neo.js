var images = [];
var imageCount = 0;

function preload() {
    for (var i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
        images[i].onload = imageLoaded;
    }
}

function imageLoaded() {
    imageCount++;
    if (imageCount === images.length) {
        // All images are loaded, you can use them now
        // For example, display them on the page or perform other operations
    }
}

//-- Preload Images that are used for the sidebar --//
preload(
    "/static/CreateAPet/CreateAPET-alt.png",
    "/static/CreateAPet/CreateAPet.png",
    "/static/PetCentral/PetCentral-alt.png",
    "/static/PetCentral/PetCentral.png",
    "/static/Logo/NeoLogo-alt.png",
    "/static/Logo/NeoLogo.png",
    "/static/sidebar/Explore-alt.png",
    "/static/sidebar/Explore.png",
    "/static/login/LoginButton-alt.png",
    "/static/Login/LoginButton.png",
    "/static/login/LogoutButton-alt.png",
    "/static/Login/LogoutButton.png",
    "/static/Sidebar/Games1.png",
    "/static/Sidebar/Games1-alt.png",
    "/static/Sidebar/Shops-alt.png",
    "/static/Sidebar/Shops.png",
    "/static/Sidebar/Mail-alt.png",
    "/static/Sidebar/Mail.png"

)

//------------SIDE BAR ANIMATION------------>>https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseover_event

function hover_createpet(element) {
    element.setAttribute('src', '/static/CreateAPet/CreateAPET-alt.png');
  }
  
  function unhover_createpet(element) {
    element.setAttribute('src', '/static/CreateAPet/CreateAPet.png');
  }

  function hover_petcentral(element) {
    element.setAttribute('src', '/static/PetCentral/PetCentral-alt.png');
  }
  
  function unhover_petcentral(element) {
    element.setAttribute('src', '/static/PetCentral/PetCentral.png');
  }

  function hover_logo(element) {
    element.setAttribute('src', '/static/Logo/NeoLogo-alt.png');
  }
  
  function unhover_logo(element) {
    element.setAttribute('src', '/static/Logo/NeoLogo.png');
  }

  function hover_explore(element) {
    element.setAttribute('src', '/static/sidebar/Explore-alt.png');
  }
  
  function unhover_explore(element) {
    element.setAttribute('src', '/static/sidebar/Explore.png');
  }

  function hover_login(element) {
    element.setAttribute('src', '/static/login/LoginButton-alt.png');
  }
  
  function unhover_login(element) {
    element.setAttribute('src', '/static/Login/LoginButton.png');
  }
  
  function hover_logout(element) {
    element.setAttribute('src', '/static/login/LogoutButton-alt.png');
  }
  
  function unhover_logout(element) {
    element.setAttribute('src', '/static/Login/LogoutButton.png');
  }

  function hover_games(element) {
    element.setAttribute('src', '/static/Sidebar/Games1-alt.png');
  }
  
  function unhover_games(element) {
    element.setAttribute('src', '/static/Sidebar/Games1.png');
  }

  function hover_shops(element) {
    element.setAttribute('src', '/static/Sidebar/Shops-alt.png');
  }
  
  function unhover_shops(element) {
    element.setAttribute('src', '/static/Sidebar/Shops.png');
  }

  function hover_mail(element) {
    element.setAttribute('src', '/static/Sidebar/Mail-alt.png');
  }
  
  function unhover_mail(element) {
    element.setAttribute('src', '/static/Sidebar/Mail.png');
  }

  function hover_signup(element) {
    element.setAttribute('src', '/static/Register/SignupClassicPurp-alt.png');
  }
  
  function unhover_signup(element) {
    element.setAttribute('src', '/static/Register/SignupClassicPurp.png');
  }

  function hover_items(element) {
    element.setAttribute('src', '/static/sidebar/items-alt.png');
  }
  
  function unhover_items(element) {
    element.setAttribute('src', '/static/sidebar/items.png');
  }
//------------SIDE BAR ANIMATION END-------->>



//------------Clock------------------------->>
/*
This clock is used to tell the time on the sidebar
*/
function startTime() {
  const today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('clock').innerHTML =  h + ":" + m + " NST";
  setTimeout(startTime, 1000);
}

function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}
//------------Clock End--------------------->>
