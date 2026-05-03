const API_URL = "https://test-frontend-student.vercel.app/api/products";
const CAT_URL = "https://test-frontend-student.vercel.app/api/categories";

// عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    fetchCategories(); // جلب التصنيفات لملء القوائم المنسدلة
});

// وظيفة لجلب التصنيفات
async function fetchCategories() {
    try {
        const response = await fetch(CAT_URL);
        const result = await response.json();
        
        if (result.success) {
            const categories = result.data; 
            const addSelect = document.getElementById("addCategoryId");
            const editSelect = document.getElementById("editCategoryId");

            let options = '<option value="">اختر التصنيف...</option>';
            categories.forEach(cat => {
                options += `<option value="${cat.id}">${cat.name}</option>`;
            });

            addSelect.innerHTML = options;
            editSelect.innerHTML = options;
        }
    } catch (error) {
        console.error("خطأ في جلب التصنيفات:", error);
    }
}

// 1. جلب المنتجات
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        if (result.success) {
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
    } catch (error) {
        console.error("خطأ في جلب المنتجات:", error);
    }
}

// 2. إضافة منتج جديد
async function createProduct() {
    const payload = {
        name: document.getElementById("addName").value,
        price: document.getElementById("addPrice").value,
        quantity: parseInt(document.getElementById("addQuantity").value),
        description: document.getElementById("addDescription").value,
        categoryId: document.getElementById("addCategoryId").value
    };

    if (!payload.categoryId) {
        alert("يرجى اختيار تصنيف!");
        return;
    }

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

// 3. جلب بيانات منتج للتعديل
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
        document.getElementById("editCategoryId").value = product.categoryId; // تعيين القيمة المختارة

        openModal('editModal');
    } catch (error) {
        console.error("خطأ في جلب بيانات المنتج:", error);
    }
}

// 4. تحديث المنتج
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

// 5. الحذف
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
