import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaTimes,
  FaCheck,
  FaSpinner,
  FaExclamationTriangle,
  FaEye,
  FaHeart,
  FaBookmark,
} from "react-icons/fa";
import e2p from "../../utils/persianNumber";

function ArticlesTab({
  styles,
  filteredArticles = [],
  searchArticle = "",
  setSearchArticle = () => {},
  isAddArticleModalOpen = false,
  setIsAddArticleModalOpen = () => {},
  newArticleForm = {},
  setNewArticleForm = () => {},
  handleAddArticleSubmit = () => {},
  isEditArticleModalOpen = false,
  setIsEditArticleModalOpen = () => {},
  editArticleForm = {},
  setEditArticleForm = () => {},
  editingArticle = null,
  setEditingArticle = () => {},
  handleEditArticleSubmit = () => {},
  articleToDelete = null,
  setArticleToDelete = () => {},
  isDeletingArticle = false,
  confirmDeleteArticle = () => {},
}) {
  return (
    <section className={styles.usersSection} style={{ width: "100%" }}>
      {/* نوار ابزار جستجو و افزودن مقاله */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <FaSearch />
          <input
            type="text"
            placeholder="جستجوی عنوان مقاله..."
            value={searchArticle}
            onChange={(e) => setSearchArticle(e.target.value)}
          />
        </div>

        <button
          className={styles.addUserBtn}
          onClick={() => setIsAddArticleModalOpen(true)}
        >
          <FaPlus /> <span>افزودن مقاله جدید</span>
        </button>
      </div>

      {/* جدول مقالات */}
      <div className={styles.tableResponsive}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>مقاله</th>
              <th>دسته‌بندی</th>
              <th>آمار</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.length === 0 ? (
              <tr>
                <td colSpan="4" className={styles.emptyTable}>
                  هیچ مقاله‌ای یافت نشد.
                </td>
              </tr>
            ) : (
              filteredArticles.map((article) => {
                const articleId = article.id || article._id;
                return (
                  <tr key={articleId}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {article.image && (
                          <img
                            src={article.image}
                            alt={article.title}
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "8px",
                              objectFit: "cover",
                            }}
                          />
                        )}
                        <strong>{article.title}</strong>
                      </div>
                    </td>
                    <td>{article.category || "تکنولوژی"}</td>
                    <td>
                      <div style={{ display: "flex", gap: "12px", fontSize: "0.85rem" }}>
                        <span>
                          <FaEye /> {e2p(article.views || 0)}
                        </span>
                        <span>
                          <FaHeart color="#ef4444" /> {e2p(article.likes || 0)}
                        </span>
                        <span>
                          <FaBookmark color="#f59e0b" /> {e2p(article.saves || 0)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.actionGroup}>
                        <button
                          className={styles.btnEdit}
                          onClick={() => {
                            setEditingArticle(article);
                            setEditArticleForm({
                              title: article.title || "",
                              description: article.description?.replace(/<[^>]*>?/gm, "") || "",
                              image: article.image || "",
                              category: article.category || "تکنولوژی",
                              tags: article.tags || "",
                            });
                            setIsEditArticleModalOpen(true);
                          }}
                          title="ویرایش مقاله"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className={styles.btnDelete}
                          onClick={() => setArticleToDelete(article)}
                          title="حذف مقاله"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* مودال افزودن مقاله */}
      {isAddArticleModalOpen && (
        <div
          className={`glassBG ${styles.modalBackdrop}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddArticleModalOpen(false);
          }}
        >
          <div className={styles.modalWindow}>
            <div className={styles.modalHeader}>
              <h3>
                <FaPlus /> افزودن مقاله جدید
              </h3>
              <button
                className={styles.closeBtn}
                onClick={() => setIsAddArticleModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddArticleSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>عنوان مقاله:</label>
                <input
                  type="text"
                  placeholder="عنوان مقاله را وارد کنید..."
                  value={newArticleForm.title || ""}
                  onChange={(e) =>
                    setNewArticleForm({ ...newArticleForm, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>آدرس تصویر (URL):</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newArticleForm.image || ""}
                  onChange={(e) =>
                    setNewArticleForm({ ...newArticleForm, image: e.target.value })
                  }
                  dir="ltr"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>دسته‌بندی:</label>
                  <input
                    type="text"
                    placeholder="فرانت‌اند، هوش مصنوعی..."
                    value={newArticleForm.category || ""}
                    onChange={(e) =>
                      setNewArticleForm({
                        ...newArticleForm,
                        category: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>برچسب‌ها (با کاما):</label>
                  <input
                    type="text"
                    placeholder="react, css, vite"
                    value={newArticleForm.tags || ""}
                    onChange={(e) =>
                      setNewArticleForm({ ...newArticleForm, tags: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>متن مقاله:</label>
                <textarea
                  rows={6}
                  placeholder="محتوای متن مقاله..."
                  value={newArticleForm.description || ""}
                  onChange={(e) =>
                    setNewArticleForm({
                      ...newArticleForm,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className={styles.modalFooter}>
                <button type="submit" className={styles.saveBtn}>
                  <FaCheck /> ثبت مقاله
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsAddArticleModalOpen(false)}
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال ویرایش مقاله */}
      {isEditArticleModalOpen && editingArticle && (
        <div
          className={`glassBG ${styles.modalBackdrop}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditArticleModalOpen(false);
          }}
        >
          <div className={styles.modalWindow}>
            <div className={styles.modalHeader}>
              <h3>
                <FaEdit /> ویرایش مقاله
              </h3>
              <button
                className={styles.closeBtn}
                onClick={() => setIsEditArticleModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleEditArticleSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>عنوان مقاله:</label>
                <input
                  type="text"
                  value={editArticleForm.title || ""}
                  onChange={(e) =>
                    setEditArticleForm({ ...editArticleForm, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>آدرس تصویر (URL):</label>
                <input
                  type="url"
                  value={editArticleForm.image || ""}
                  onChange={(e) =>
                    setEditArticleForm({ ...editArticleForm, image: e.target.value })
                  }
                  dir="ltr"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>دسته‌بندی:</label>
                  <input
                    type="text"
                    value={editArticleForm.category || ""}
                    onChange={(e) =>
                      setEditArticleForm({
                        ...editArticleForm,
                        category: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>برچسب‌ها:</label>
                  <input
                    type="text"
                    value={editArticleForm.tags || ""}
                    onChange={(e) =>
                      setEditArticleForm({ ...editArticleForm, tags: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>متن مقاله:</label>
                <textarea
                  rows={6}
                  value={editArticleForm.description || ""}
                  onChange={(e) =>
                    setEditArticleForm({
                      ...editArticleForm,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className={styles.modalFooter}>
                <button type="submit" className={styles.saveBtn}>
                  <FaCheck /> ذخیره تغییرات
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsEditArticleModalOpen(false)}
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال تأیید حذف مقاله */}
      {articleToDelete && (
        <div
          className={styles.modalBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeletingArticle)
              setArticleToDelete(null);
          }}
        >
          <div className={styles.modalWindow}>
            <div className={styles.modalHeader}>
              <h3 style={{ color: "#dc2626" }}>
                <FaExclamationTriangle /> تأیید حذف مقاله
              </h3>
              <button
                className={styles.closeBtn}
                onClick={() => setArticleToDelete(null)}
                disabled={isDeletingArticle}
              >
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalForm}>
              <div className={styles.warningBox}>
                <p>
                  آیا از حذف مقاله <strong>«{articleToDelete.title}»</strong> اطمینان دارید؟
                </p>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.dangerConfirmBtn}
                  onClick={confirmDeleteArticle}
                  disabled={isDeletingArticle}
                >
                  {isDeletingArticle ? (
                    <FaSpinner className="spinIcon" />
                  ) : (
                    <FaTrashAlt />
                  )}
                  <span>حذف مقاله</span>
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setArticleToDelete(null)}
                  disabled={isDeletingArticle}
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ArticlesTab;
