const BASE_URL = "https://test-frontend-student.vercel.app/api/categories";

// عند تحميل الصفحة، جلب البيانات
document.addEventListener("DOMContentLoaded", fetchCategories);

// 1. جلب جميع التصنيفات (GET)
async function fetchCategories() {
    try {
        const response = await fetch(BASE_URL);
        const result = await response.json();
        if (result.success) {
            displayCards(result.data);
        }
    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
    }
}

// عرض الكروت في الصفحة
function displayCards(categories) {
    const container = document.getElementById("cardsContainer");
    container.innerHTML = ""; // مسح المحتوى القديم

    categories.forEach(item => {
        const card = `
            <div class="card" id="card-${item.id}">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <div class="card-btns">
                    <button onclick="openEditModal('${item.id}')">تعديل</button>
                    <button onclick="openDeleteModal('${item.id}')">حذف</button>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// 2. إضافة تصنيف جديد (POST)
async function createCategory() {
    const name = document.getElementById("addName").value;
    const description = document.getElementById("addDescription").value;

    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description })
        });
        if (response.ok) {
            closeModal('addModal');
            fetchCategories(); // إعادة تحديث القائمة
        }
    } catch (error) {
        console.error("خطأ أثناء الإضافة:", error);
    }
}

// 3. فتح نافذة التعديل وجلب بيانات العنصر (GET by ID)
async function openEditModal(id) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`);
        const result = await response.json();
        
        // تعبئة الحقول بالبيانات الحالية
        document.getElementById("editId").value = result.data.id;
        document.getElementById("editName").value = result.data.name;
        document.getElementById("editDescription").value = result.data.description;
        
        openModal('editModal');
    } catch (error) {
        console.error("خطأ في جلب تفاصيل العنصر:", error);
    }
}

// 4. تحديث البيانات (PUT)
async function updateCategory() {
    const id = document.getElementById("editId").value;
    const name = document.getElementById("editName").value;
    const description = document.getElementById("editDescription").value;

    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description })
        });
        if (response.ok) {
            closeModal('editModal');
            fetchCategories();
        }
    } catch (error) {
        console.error("خطأ أثناء التحديث:", error);
    }
}

// 5. حذف عنصر (DELETE)
function openDeleteModal(id) {
    document.getElementById("deleteId").value = id;
    openModal('deleteModal');
}

async function confirmDelete() {
    const id = document.getElementById("deleteId").value;
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE"
        });
        if (response.ok) {
            closeModal('deleteModal');
            fetchCategories();
        }
    } catch (error) {
        console.error("خطأ أثناء الحذف:", error);
    }
}

// وظائف مساعدة لفتح وإغلاق النوافذ
function openModal(id) {
    document.getElementById(id).style.display = "block";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}