/**
 * bonus mark for sorting
 */
const loaderActive = (isActive) => {
  const loader = document.getElementById("loading");

  if (isActive) {
    loader.classList.remove("hidden");
  } else {
    loader.classList.add("hidden");
  }
};

// ============== FETCH ALL DATA ===============
const fetchAllData = async () => {
  const url = "https://openapi.programming-hero.com/api/ai/tools";

  loaderActive(true);

  try {
    const res = await fetch(url);
    const data = await res.json();

    displayAllData(data.data.tools.slice(0, 6));
  } catch (error) {
    console.log(error);
  }
};

// ============= DISPLAY ALL DATA ===========================
const displayAllData = (data) => {
  document.getElementById("sort").addEventListener("click", () => {
    objectSort(data);
  });

  loaderActive(true);

  const cardContainer = document.getElementById("card__container");
  cardContainer.innerHTML = "";
  data.forEach((item) => {
    const { image, features, name, published_in, id } = item;
    cardContainer.innerHTML += `
       <div class="card bg-base-100 shadow-xl border hover:-translate-y-3 transition">
            <figure class="p-3">
              <img
                class="h-[16rem] w-full rounded-md"
                src=${image}
                alt="Shoes"
              />
            </figure>
            <div class="card-body">
              <h2 class="card-title">Features</h2>
              <ul>
                
                ${featureContentDisplay(features)}
                <hr class="my-5 h-[1px] bg-teal-300/30">
              </ul>

              <div class="flex justify-between items-center">
                <div class="space-y-3">
                  <p class="card-title">${name}</p>
                  <p
                    class="flex items-center gap-2 text-[12px] font-semibold text-gray-600"
                  >
                    <i class="ri-calendar-2-line text-lg"></i>
                    ${published_in}
                  </p>
                </div>

                <div class="cursor-pointer">
                  <label for='my-modal'>
                  <i onclick="fetchSingleData('${id}')"
                    class="ri-arrow-right-line w-10 h-10 bg-rose-400/30 p-2 rounded-full text-rose-700 transition hover:bg-rose-400/40 text-lg"
                  ></i>
                  </label>
                </div>
              </div>
            </div>
          </div>
       
       `;
  });

  loaderActive(false);
};

// ============ DISPLAY FEATURE CONTENT ============
function featureContentDisplay(items) {
  let num = 1;
  let liHtml = "";
  items.forEach((item) => {
    liHtml += `<li class="text-sm my-1 text-gray-700">
                  <span>${num++}</span>
                  <span>${item}</span>
                </li>`;
  });

  return liHtml;
}

async function fetchSingleData(id) {
  const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    displaySingleData(data.data);
  } catch (error) {
    console.log(error);
  }
}

function displaySingleData(data) {
  const modalBody = document.getElementById("modal__body");


  modalBody.innerHTML = `
        <div class="grid md:grid-cols-2 gap-3 ">
            <div class="border border-rose-600 rounded-md p-7 bg-rose-300/10">
            <h1 class="sm:text-2xl font-semibold">${data.description}</h1>

            <div class="grid gap-2 md:grid-cols-2 lg:grid-cols-3 my-5">
                <div class="bg-blue-600/10 p-2 rounded-md">
                    <p class="text-blue-600 font-semibold text-center">${
                      data.pricing ? data.pricing[0].price : "free of cost"
                    } <br/>${
    data.pricing ? data.pricing[0].plan : "No Data found"
  }</p>
                </div>
                <div class="bg-teal-600/10 p-2 rounded-md"><p class="text-teal-600 font-semibold text-center">${
                  data.pricing ? data.pricing[1].price : "No price available"
                } <br/> ${
    data.pricing ? data.pricing[1].plan : "No Data found"
  }</p></div>
                <div class="bg-red-600/10 p-2 rounded-md"><p class="text-red-600 font-semibold text-center">${
                  data.pricing ? data.pricing[2].price : "free cost of"
                } <br/> ${
    data.pricing ? data.pricing[2].plan : "No Data found"
  }</p></div>
            </div>

            <div class="flex justify-between items-center text-2xl font-semibold my-3">
                <p>Features</p>
                <p>Integrations</p>
            </div>

           <div class="grid grid-cols-2 gap-3">
            <ul>
                <li class="flex gap-1"> <i class="ri-check-line text-green-500 text-[13]"></i> ${
                  data.features["1"].feature_name
                    ? data.features["1"].feature_name
                    : "not available"
                }</li>
                <li class="flex gap-1"> <i class="ri-check-line text-green-500 text-[13]"></i> ${
                  data.features["2"].feature_name
                    ? data.features["2"].feature_name
                    : "not available"
                }</li>
                <li class="flex gap-1"> <i class="ri-check-line text-green-500 text-[13]"></i> ${
                  data.features["3"].feature_name
                    ? data.features["3"].feature_name
                    : "not available"
                }</li>
            </ul>

            <ul>
                ${socialContactDisplay(
                  data.integrations ? data.integrations : ["No Data found"]
                )}
            </ul>
           </div>
        </div>

        <div class="border border-teal-200 rounded-md p-5 bg-teal-300/10 relative">
            <img class="w-full h-[15rem] object-cover rounded-md" src=${
              data.image_link[0]
            } alt="">

            <div class="text-center my-4">
                <h1 class="text-2xl font-semibold my-3">${
                  data.input_output_examples
                    ? data.input_output_examples[0].input
                    : "Not available"
                }</h1>
                <p>
                ${
                  data.input_output_examples
                    ? data.input_output_examples[0].output
                    : "Not available"
                }
                </p>
            </div>

            <p class="absolute top-7 right-7 w-max bg-red-400 py-1 px-2 rounded-md text-white ${
              data.accuracy.score === null ? "hidden" : "block"
            } "> ${data.accuracy.score + " accuracy"} </p>
        </div>
        </div>
    `;
}

// ============ DISPLAY SOCIAL CONTACT ============
function socialContactDisplay(items) {
  items = items ? items : "No Data Available";

  let liHtml = "";
  items.forEach((item) => {
    liHtml += `
        <li> ${item ? item : "No Data found"}</li>
    `;
  });


  return liHtml;
}

//  ============DATA LOAD ===========
fetchAllData();

// ================= CLICK TO SHOW ALL DATA FUNCTION =================
const fetchShowAllData = async () => {
  const url = "https://openapi.programming-hero.com/api/ai/tools";

  const show__more = document.getElementById("show__more");
  show__more.classList.add("hidden");
  loaderActive(true);

  try {
    const res = await fetch(url);
    const data = await res.json();

    displayAllData(data.data.tools);
  } catch (error) {
    console.log(error);
  }
};

document
  .getElementById("show__more")
  .addEventListener("click", fetchShowAllData);

// ====================== ITEM SORT FUNCTION ==================
const objectSort = (array) => {
  array.sort((a, b) => {
    const dateA = new Date(a.published_in);
    const dateB = new Date(b.published_in);

    return dateA - dateB;
  });

  displayAllData(array);
};
