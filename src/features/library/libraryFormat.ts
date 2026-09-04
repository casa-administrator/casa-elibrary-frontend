export function formatFileSize(
  bytes: number | null,
): string {
  if (
    bytes === null ||
    bytes === undefined
  ) {
    return "—";
  }

  if (bytes === 0) {
    return "0 B";
  }

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
  ];

  const index =
    Math.floor(
      Math.log(bytes) /
      Math.log(1024),
    );

  const value =
    bytes /
    Math.pow(
      1024,
      index,
    );

  return `${value.toFixed(
    index === 0 ? 0 : 1,
  )} ${units[index]}`;
}


export function formatDate(
  value: string | null,
  language: string,
): string {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    language === "km"
      ? "km-KH"
      : "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  ).format(date);
}


export function getDocumentType(
  extension: string | null,
  mimeType: string,
): string {
  if (extension) {
    return extension
      .replace(".", "")
      .toUpperCase();
  }

  if (
    mimeType.includes(
      "pdf",
    )
  ) {
    return "PDF";
  }

  return "FILE";
}