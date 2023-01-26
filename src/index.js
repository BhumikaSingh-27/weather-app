import "./styles.css";

const formEle = document.querySelector(".top-banner form");
const userInput = document.querySelector(".top-banner form input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".weather-list .cities");

formEle.addEventListener("submit", function (e) {
  e.preventDefault();
  let inputValue = userInput.value;
  // console.log(inputValue);

  const api_key = "dcf1c6d26a4f0fc4980a1933e4e58bab";

  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);
  if (listItemsArray.length > 0) {
    //2
    const filteredArray = listItemsArray.filter((el) => {
      let content = "";
      //athens,gr
      if (inputValue.includes(",")) {
        //athens,grrrrrr->invalid country code, so we keep only the first part of inputVal
        if (inputValue.split(",")[1].length > 2) {
          inputValue = inputValue.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        //athens
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content === inputValue.toLowerCase();
    });

    //3
    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      } ...otherwise be more specific by providing the country code as well 😉`;
      formEle.reset();
      inputValue.focus();
      return;
    }
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${api_key}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const { main, name, sys, weather } = data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`;
      const li = document.createElement("li");
      li.classList.add("city");
      const markup = ` 
<h2 class="city-name" data-name="${name},${sys.country}"> 
<span>${name}</span> 
<sup>${sys.country}</sup> 
</h2> 
<div class="city-temp">${Math.round(main.temp)}<sup>°C</sup> 
</div> 
<figure> 
<img class="city-icon" src=${icon} alt=${weather[0]["main"]}> 
<figcaption>${weather[0]["description"]}</figcaption> 
</figure> 
`;
      li.innerHTML = markup;
      list.appendChild(li);
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city 😩";
    });
  msg.textContent = "";
  formEle.reset();
  userInput.focus();
});
