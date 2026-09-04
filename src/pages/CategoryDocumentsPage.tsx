import { type FormEvent, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { useNavigate, useParams } from "react-router-dom";

import { getCategoryDocuments } from "../api/library";

import type { LibraryDocumentListResponse } from "../api/library";

import AppLayout from "../components/layout/AppLayout";

import DocumentTable from "../features/library/DocumentTable";

import "../features/library/documents.css";

export default function CategoryDocumentsPage() {
  const { categoryId } = useParams();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const [data, setData] = useState<LibraryDocumentListResponse | null>(null);

  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!categoryId) {
      return;
    }

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getCategoryDocuments(categoryId, {
          search,
          page,
          perPage: 20,
        });

        setData(result);
      } catch (error) {
        console.error("Document load error:", error);

        setError(t("documents.loadFailed"));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [categoryId, search, page, t]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPage(1);

    setSearch(searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  return (
    <AppLayout>
      <section className="documents-page">
        <button
          type="button"
          className="documents-page__back"
          onClick={() => navigate("/library")}
        >
          ← {t("documents.backToLibrary")}
        </button>

        <header className="documents-page__header">
          <div>
            <h1>{data?.category_name ?? t("navigation.library")}</h1>

            {data && (
              <p>
                {data.total} {t("library.documents")}
              </p>
            )}
          </div>
        </header>

        <form className="documents-search" onSubmit={handleSearch}>
          <input
            type="search"
            value={searchInput}
            placeholder={t("documents.searchPlaceholder")}
            onChange={(event) => setSearchInput(event.target.value)}
          />

          <button type="submit" className="documents-search__button">
            {t("common.search")}
          </button>

          {search && (
            <button
              type="button"
              className="documents-search__clear"
              onClick={clearSearch}
            >
              {t("documents.clearSearch")}
            </button>
          )}
        </form>

        {loading && (
          <div className="documents-state">{t("documents.loading")}</div>
        )}

        {!loading && error && (
          <div className="documents-state documents-state--error">{error}</div>
        )}

        {!loading && !error && data && data.items.length === 0 && (
          <div className="documents-state">
            <h3>{t("documents.noDocuments")}</h3>

            <p>{t("documents.noDocumentsDescription")}</p>
          </div>
        )}

        {!loading && !error && data && data.items.length > 0 && (
          <>
            <DocumentTable documents={data.items} />

            <div className="documents-pagination">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
              >
                {t("documents.previous")}
              </button>

              <span>
                {t("documents.page")} {data.page} {t("documents.of")}{" "}
                {Math.max(data.pages, 1)}
              </span>

              <button
                type="button"
                disabled={page >= data.pages}
                onClick={() => setPage((current) => current + 1)}
              >
                {t("documents.next")}
              </button>
            </div>
          </>
        )}
      </section>
    </AppLayout>
  );
}
