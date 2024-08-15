const API_URL = "http://localhost:3200";

let isEditing = false;
let currentEditingFoodName = "";

document.addEventListener("DOMContentLoaded", () => {
    fetchFoodItems();

    const foodForm = document.getElementById("food-form");
    foodForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const foodItemName = document.getElementById("food-item-name").value;
        const foodData = {
            food_item_name: foodItemName,
            food_group: document.getElementById("food-group").value,
            description: document.getElementById("description").value,
            ingredients: document.getElementById("ingredients").value.split(","),
            serving_size: document.getElementById("serving-size").value,
            certifications: document.getElementById("certifications").value.split(","),
            health_benefits: document.getElementById("health-benefits").value.split(","),
            country_of_origin: document.getElementById("country-of-origin").value,
            preparation_methods: document.getElementById("preparation-methods").value.split(","),
            dietary_restrictions: document.getElementById("dietary-restrictions").value.split(","),
            brand_or_manufacturer: document.getElementById("brand-or-manufacturer").value,
            nutritional_information: {
                fat: Number(document.getElementById("fat").value),
                fiber: Number(document.getElementById("fiber").value),
                protein: Number(document.getElementById("protein").value),
                calories: Number(document.getElementById("calories").value),
                carbohydrates: Number(document.getElementById("carbohydrates").value),
            },
            allergens: document.getElementById("allergens").value.split(","),
        };

        if (isEditing) {
            await updateFoodItem(currentEditingFoodName, foodData);
            isEditing = false;
            currentEditingFoodName = "";
        } else {
            await saveFoodItem(foodData);
        }

        foodForm.reset();
        fetchFoodItems();
    });
});

async function fetchFoodItems() {
    const response = await fetch(`${API_URL}/`);
    const foodItems = await response.json();
    const foodTableBody = document.querySelector("#food-table tbody");
    foodTableBody.innerHTML = "";

    foodItems.forEach((food) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${food.food_item_name}</td>
            <td>${food.food_group}</td>
            <td>${food.description}</td>
            <td>${food.ingredients.join(", ")}</td>
            <td>${food.serving_size}</td>
            <td>${food.certifications.join(", ")}</td>
            <td>${food.health_benefits.join(", ")}</td>
            <td>${food.country_of_origin}</td>
            <td>${food.preparation_methods.join(", ")}</td>
            <td>${food.dietary_restrictions.join(", ")}</td>
            <td>${food.brand_or_manufacturer}</td>
            <td>Fat: ${food.nutritional_information.fat}g, Fiber: ${food.nutritional_information.fiber}g, 
                Protein: ${food.nutritional_information.protein}g, Calories: ${food.nutritional_information.calories}, 
                Carbs: ${food.nutritional_information.carbohydrates}g</td>
            <td>${food.allergens.join(", ")}</td>
            <td>
                <button class="edit" onclick='populateFormForEdit(${JSON.stringify(food)})'>Edit</button>
                <button onclick="deleteFoodItem('${food.food_item_name}')">Delete</button>
            </td>
        `;

        foodTableBody.appendChild(tr);
    });
}

async function saveFoodItem(foodData) {
    const response = await fetch(`${API_URL}/postfood`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(foodData),
    });
    return response.json();
}

async function updateFoodItem(foodItemName, foodData) {
    const response = await fetch(`${API_URL}/foods/${foodItemName}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(foodData),
    });
    return response.json();
}

async function deleteFoodItem(foodItemName) {
    const response = await fetch(`${API_URL}/foods/${foodItemName}`, {
        method: "DELETE",
    });
    fetchFoodItems();
}

function populateFormForEdit(food) {
    isEditing = true;
    currentEditingFoodName = food.food_item_name;

    document.getElementById("food-item-name").value = food.food_item_name;
    document.getElementById("food-group").value = food.food_group;
    document.getElementById("description").value = food.description;
    document.getElementById("ingredients").value = food.ingredients.join(",");
    document.getElementById("serving-size").value = food.serving_size;
    document.getElementById("certifications").value = food.certifications.join(",");
    document.getElementById("health-benefits").value = food.health_benefits.join(",");
    document.getElementById("country-of-origin").value = food.country_of_origin;
    document.getElementById("preparation-methods").value = food.preparation_methods.join(",");
    document.getElementById("dietary-restrictions").value = food.dietary_restrictions.join(",");
    document.getElementById("brand-or-manufacturer").value = food.brand_or_manufacturer;
    document.getElementById("fat").value = food.nutritional_information.fat;
    document.getElementById("fiber").value = food.nutritional_information.fiber;
    document.getElementById("protein").value = food.nutritional_information.protein;
    document.getElementById("calories").value = food.nutritional_information.calories;
    document.getElementById("carbohydrates").value = food.nutritional_information.carbohydrates;
    document.getElementById("allergens").value = food.allergens.join(",");
}
