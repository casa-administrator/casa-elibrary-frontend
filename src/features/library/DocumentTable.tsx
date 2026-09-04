import { useTranslation } from "react-i18next";

import type { LibraryDocument } from "../../api/library";

import { getDocumentDownloadUrl, getDocumentViewUrl } from "../../api/library";

import { formatDate, formatFileSize, getDocumentType } from "./libraryFormat";

interface DocumentTableProps {
  documents: LibraryDocument[];
}

export default function DocumentTable({ documents }: DocumentTableProps) {
  const { t, i18n } = useTranslation();

  const handleView = (documentId: string) => {
    window.open(
      getDocumentViewUrl(documentId),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleDownload = (documentId: string) => {
    const link = document.createElement("a");

    link.href = getDocumentDownloadUrl(documentId);

    link.style.display = "none";

    document.body.appendChild(link);

    link.click();

    link.remove();
  };

  return (
    <div className="document-table-wrapper">
      <table className="document-table">
        <thead>
          <tr>
            <th>{t("documents.name")}</th>

            <th>{t("documents.type")}</th>

            <th>{t("documents.size")}</th>

            <th>{t("documents.modified")}</th>

            <th>{t("documents.actions")}</th>
          </tr>
        </thead>

        <tbody>
          {documents.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="document-name">
                  <div className="document-name__icon">
                    {getDocumentType(item.extension, item.mime_type)}
                  </div>

                  <div>
                    <strong>{item.name}</strong>

                    {item.relative_path && <span>{item.relative_path}</span>}
                  </div>
                </div>
              </td>

              <td>{getDocumentType(item.extension, item.mime_type)}</td>

              <td>{formatFileSize(item.file_size)}</td>

              <td>
                {formatDate(
                  item.drive_modified_at,
                  i18n.resolvedLanguage ?? "km",
                )}
              </td>

              <td>
                <div className="document-actions">
                  <button type="button" onClick={() => handleView(item.id)}>
                    {t("documents.view")}
                  </button>

                  {item.can_download && (
                    <button
                      type="button"
                      className="document-actions__download"
                      onClick={() => handleDownload(item.id)}
                    >
                      {t("documents.download")}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
