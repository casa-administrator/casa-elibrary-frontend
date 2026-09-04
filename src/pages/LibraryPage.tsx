import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { ApiError } from "../api/client";

import { getLibraryCategories } from "../api/library";

import type { LibraryCategory } from "../api/library";

import AppLayout from "../components/layout/AppLayout";

import CategoryCard from "../features/library/CategoryCard";

import "../features/library/library.css";

export default function LibraryPage() {
  const { t } = useTranslation();

  const [categories, setCategories] = useState<LibraryCategory[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getLibraryCategories();

        setCategories(result.items);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError(t("library.loadFailed"));
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [t]);

  return (
    <AppLayout>
      <section className="library-page">
        <header className="library-page__header">
          <div>
            <h1>{t("library.title")}</h1>

            <p>{t("library.subtitle")}</p>
          </div>
        </header>

        <h2 className="library-page__section-title">
          {t("library.categories")}
        </h2>

        {loading && <div className="library-state">{t("common.loading")}</div>}

        {!loading && error && (
          <div className="library-state">
            <h3>{t("library.loadFailed")}</h3>

            <p>{error}</p>
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="library-state">
            <h3>{t("library.noCategories")}</h3>

            <p>{t("library.noCategoriesDescription")}</p>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="category-grid">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
}
