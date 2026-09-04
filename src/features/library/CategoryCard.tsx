import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";

import type { LibraryCategory } from "../../api/library";

import "./library.css";

interface CategoryCardProps {
  category: LibraryCategory;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const openCategory = () => {
    navigate(`/library/${category.id}`);
  };

  return (
    <article
      className="category-card"
      role="button"
      tabIndex={0}
      onClick={openCategory}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          openCategory();
        }
      }}
    >
      <div className="category-card__icon">📁</div>

      <div className="category-card__body">
        <h3>{category.name}</h3>

        {category.description && <p>{category.description}</p>}

        <div className="category-card__meta">
          <span>
            {category.document_count} {t("library.documents")}
          </span>

          <span
            className={[
              "category-card__badge",
              category.can_download ? "category-card__badge--download" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {category.can_download
              ? t("library.downloadAllowed")
              : t("library.viewOnly")}
          </span>
        </div>
      </div>

      <div className="category-card__arrow">→</div>
    </article>
  );
}
