const API_URL = "https://test-frontend-student.vercel.app/api/products";

// جلب المنتجات عند تشغيل الصفحة
document.addEventListener("DOMContentLoaded", fetchProducts);

// 1. جلب المنتجات (GET)
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        if (result.success) {
            // renderTable(result.data.items); // لاحظ الدخول إلى data.items
            const products = result.data.items;
                const tableBody = document.getElementById("productsTableBody");
    tableBody.innerHTML = "";

    products.forEach(product => {
        const row = `
            <tr>
                <td>${product.name}</td>
                <td><span class="badge">${product.category?.name || 'غير مصنف'}</span></td>
                <td>${product.price} $</td>
                <td>${product.quantity}</td>
                <td>${product.description}</td>
                <td class="table-actions">
                    <button class="edit-btn" onclick="openEditModal('${product.id}')">تعديل</button>
                    <button class="delete-btn" onclick="openDeleteModal('${product.id}')">حذف</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}
        }
    } catch (error) {
        console.error("خطأ في جلب المنتجات:", error);
    }
}

// // رسم الجدول
// function renderTable(products) {
//     const tableBody = document.getElementById("productsTableBody");
//     tableBody.innerHTML = "";

//     products.forEach(product => {
//         const row = `
//             <tr>
//                 <td>${product.name}</td>
//                 <td><span class="badge">${product.category?.name || 'غير مصنف'}</span></td>
//                 <td>${product.price} $</td>
//                 <td>${product.quantity}</td>
//                 <td>${product.description}</td>
//                 <td class="table-actions">
//                     <button class="edit-btn" onclick="openEditModal('${product.id}')">تعديل</button>
//                     <button class="delete-btn" onclick="openDeleteModal('${product.id}')">حذف</button>
//                 </td>
//             </tr>
//         `;
//         tableBody.innerHTML += row;
//     });
// }

// 2. إضافة منتج جديد (POST)
async function createProduct() {
    const payload = {
        name: document.getElementById("addName").value,
        price: document.getElementById("addPrice").value,
        quantity: parseInt(document.getElementById("addQuantity").value),
        description: document.getElementById("addDescription").value,
        categoryId: document.getElementById("addCategoryId").value
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            closeModal('addModal');
            fetchProducts();
            clearInputs(['addName', 'addPrice', 'addQuantity', 'addDescription', 'addCategoryId']);
        }
    } catch (error) {
        console.error("خطأ في الإضافة:", error);
    }
}

// 3. جلب بيانات منتج للتعديل (GET by ID)
async function openEditModal(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const result = await response.json();
        const product = result.data;

        document.getElementById("editId").value = product.id;
        document.getElementById("editName").value = product.name;
        document.getElementById("editPrice").value = product.price;
        document.getElementById("editQuantity").value = product.quantity;
        document.getElementById("editDescription").value = product.description;
        document.getElementById("editCategoryId").value = product.categoryId;

        openModal('editModal');
    } catch (error) {
        console.error("خطأ في جلب بيانات المنتج:", error);
    }
}

// 4. تحديث المنتج (PUT)
async function updateProduct() {
    const id = document.getElementById("editId").value;
    const payload = {
        name: document.getElementById("editName").value,
        price: document.getElementById("editPrice").value,
        quantity: parseInt(document.getElementById("editQuantity").value),
        description: document.getElementById("editDescription").value,
        categoryId: document.getElementById("editCategoryId").value
    };

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            closeModal('editModal');
            fetchProducts();
        }
    } catch (error) {
        console.error("خطأ في التحديث:", error);
    }
}

// 5. الحذف (DELETE)
function openDeleteModal(id) {
    document.getElementById("deleteId").value = id;
    openModal('deleteModal');
}

async function confirmDelete() {
    const id = document.getElementById("deleteId").value;
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (response.ok) {
            closeModal('deleteModal');
            fetchProducts();
        }
    } catch (error) {
        console.error("خطأ في الحذف:", error);
    }
}

// وظائف مساعدة
function openModal(id) { document.getElementById(id).style.display = "block"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }
function clearInputs(ids) { ids.forEach(id => document.getElementById(id).value = ""); }
