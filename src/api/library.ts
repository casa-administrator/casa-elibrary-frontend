import { apiRequest } from "./client";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:8000/api/v1";


export interface LibraryCategory {
  id: string;
  name: string;
  description: string | null;
  order: number;
  document_count: number;
  can_download: boolean;
}


export interface LibraryCategoryListResponse {
  items: LibraryCategory[];
  total: number;
}


export interface LibraryDocument {
  id: string;
  category_id: string;
  name: string;
  mime_type: string;
  extension: string | null;
  file_size: number | null;
  relative_path: string | null;
  is_google_native: boolean;
  drive_modified_at: string | null;
  can_download: boolean;
}


export interface LibraryDocumentListResponse {
  category_id: string;
  category_name: string;
  can_download: boolean;

  items: LibraryDocument[];

  page: number;
  per_page: number;
  total: number;
  pages: number;
}


export function getLibraryCategories() {
  return apiRequest<LibraryCategoryListResponse>(
    "/library/categories",
  );
}


interface GetDocumentsOptions {
  search?: string;
  page?: number;
  perPage?: number;
}


export function getCategoryDocuments(
  categoryId: string,
  options: GetDocumentsOptions = {},
) {
  const params =
    new URLSearchParams();

  if (options.search) {
    params.set(
      "search",
      options.search,
    );
  }

  params.set(
    "page",
    String(options.page ?? 1),
  );

  params.set(
    "per_page",
    String(options.perPage ?? 20),
  );


  return apiRequest<LibraryDocumentListResponse>(
    `/library/categories/${categoryId}/documents?${params.toString()}`,
  );
}


export function getDocumentViewUrl(
  documentId: string,
) {
  return `${API_BASE_URL}/library/documents/${documentId}/view`;
}


export function getDocumentDownloadUrl(
  documentId: string,
) {
  return `${API_BASE_URL}/library/documents/${documentId}/download`;
}