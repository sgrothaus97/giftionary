
//starter sidebar words
var sideWords =["Unicorn", "Platypus","Water", "Rainbows"]
//pulls previous searches from local storage 
var savedSearch = localStorage.getItem("searched word")

if(localStorage.getItem("initialSearchTerm")){
  var firstSearch = localStorage.getItem("initialSearchTerm")
  runSearchBar(firstSearch)
  sideWords.push(firstSearch.charAt(0).toUpperCase()+firstSearch.slice(1))
  renderSearchHistory(firstSearch)
}

//when searching pops up three ajax calls of gif, definition and a random quote
$("#searchBtn").on("click", function(event){
    event.preventDefault();
  var searchWord = $("#search-word").val().trim()
  sideWords.push(searchWord.charAt(0).toUpperCase()+searchWord.slice(1))
  localStorage.setItem("searched word", searchWord)
  runSearchBar(searchWord);
  renderSearchHistory();
})
//runs search when user presses enter
$('#search-word').keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode == '13'){
    event.preventDefault();
    var searchWord = $("#search-word").val().trim()
    sideWords.push(searchWord)
    localStorage.setItem("searched word", searchWord)
    runSearchBar(searchWord);
    renderSearchHistory();
  }
});
//3 ajax calls
  function runSearchBar(searchWord){
    $("#gifs-go-here").empty();  
    $("#definition").empty();
    $("#quotes-go-here").empty();
  //search for gif of word searched for from Giphy API.
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
  searchWord + "&api_key=dc6zaTOxFJmzC&limit=10";
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function(response) {
        console.log(response)
      var results = response.data[0];
      // Creating an image tag
      var gifImage = $("<img class='pure-img'>");
          gifImage.attr("src", results.images.fixed_height.url);

        $("#gifs-go-here").prepend(gifImage);
      })
  
    var dictionaryURL = "https://dictionaryapi.com/api/v3/references/learners/json/"+ searchWord + "?key=ef3cb261-7a7c-465a-b6f5-4115280961f7"
  //Merriam Webster API to pull a short learners definition of word from search
  $.ajax({
      url: dictionaryURL,
      method: "GET"
    })
      .then(function(response) {
          console.log(response)
          var title = response[0].meta.id
          var definition = response[0].shortdef[0]
          var defTitle = $(`<h2>${searchWord}</h2><br><h3>Definition</h3>`)
          var defText = $(`<p>${definition}</p>`)
          $("#definition").append(defTitle)
          $("#definition").append(defText)
          
      })
      //Ajax to pull a random quote with the searched word in it
      var quoteURL = "https://quote-garden.herokuapp.com/api/v2/quotes/ "+ searchWord + " ?"
      $.ajax({
        url: quoteURL,
        method: "GET"
      })
        .then(function(response) {
            console.log(response)
            var quotes = response.quotes[0]
            var quoteTitle = $(`<h3>${"Random Quote"}</h3>`)

            var quote = $(`<p>${quotes.quoteText}<br>${"~ "+ quotes.quoteAuthor}</p>`)
            $("#quotes-go-here").append(quoteTitle)
            $("#quotes-go-here").append(quote)
            if(searchWord === undefined){
              $("#quotes-go-here").addclass("display: none")
            }
  
            
        })
  
    }

//builds search history
function renderSearchHistory(){
  $("#searchHistory").empty();
  for(var i=0; i <sideWords.length; i++){
  var pastSearch = $("<li>");
  pastSearch.addClass("searchedWord")
  pastSearch.attr("data-name", sideWords[i]);
  pastSearch.text(sideWords[i]);
  $("#searchHistory").prepend(pastSearch)

  } }
  //makes previous searches clickable
$(document).on("click", ".searchedWord", function(){
  runSearchBar($(this).attr("data-name"));
} )

renderSearchHistory();