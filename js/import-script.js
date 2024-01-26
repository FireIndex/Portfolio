function include_html() {
  //  object loop in js
  const obj = {
    '.import_navbar': '/components/navbar.html',
    '.import_footer': '/components/footer.html',
  }

  // https://www.youtube.com/watch?v=lwRiLHwHOjQ&ab_channel=CSwithNJ
  for (let key in obj) {
    const nav = document.querySelector(key)
    fetch(obj[key])
      .then((res) => res.text())
      .then((data) => {
        nav.innerHTML = data
      })
  }
}

// Path: js/active-link.js
function setActiveLink() {
  // Get the current page URL
  var currentPage = window.location.href

  // Get all the links in the navigation
  var navs = document.querySelectorAll('.nav a')
  var footers = document.querySelectorAll('.footercontent a')
  var links = [...navs, ...footers]

  // Loop through each link
  links.forEach(function (link) {
    // Check if the link's href matches the current page URL
    if (link.href === currentPage) {
      // Add the 'w--current' class to the link
      link.classList.add('w--current')
    } else {
      // Remove the 'w--current' class from other links
      link.classList.remove('w--current')
    }
  })
}

include_html() // Call include_html() to include HTML files
window.onload = setActiveLink // Call setActiveLink() when the page loads
