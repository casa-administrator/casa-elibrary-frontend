import "./CasaSsoTransition.css";

type Status = "loading" | "success" | "error";

interface CasaSsoTransitionProps {
  serviceName: string;
  serviceNameKm?: string;
  status: Status;
  message?: string;
  onReturn?: () => void;
}

export function CasaSsoTransition({
  serviceName,
  serviceNameKm,
  status,
  message,
  onReturn,
}: CasaSsoTransitionProps) {
  return (
    <main className="casa-sso">
      <div className="casa-sso__background casa-sso__background--one" />
      <div className="casa-sso__background casa-sso__background--two" />

      <section className="casa-sso__card">
        <div className="casa-sso__brand">
          <div className="casa-sso__logo">CASA</div>

          <div>
            <p className="casa-sso__brand-name">CASA Administration</p>

            <p className="casa-sso__brand-subtitle">Secure Service Gateway</p>
          </div>
        </div>

        <div className="casa-sso__divider" />

        <div className={`casa-sso__status casa-sso__status--${status}`}>
          {status === "loading" && (
            <div className="casa-sso__loader">
              <span />
              <span />
              <span />
            </div>
          )}

          {status === "success" && (
            <div className="casa-sso__status-icon">✓</div>
          )}

          {status === "error" && <div className="casa-sso__status-icon">!</div>}
        </div>

        <div className="casa-sso__content">
          <p className="casa-sso__eyebrow">CASA SERVICE</p>

          <h1>{serviceName}</h1>

          {serviceNameKm && <p className="casa-sso__khmer">{serviceNameKm}</p>}

          {status === "loading" && (
            <>
              <h2>Connecting securely</h2>

              <p className="casa-sso__message">
                Verifying your CASA access and preparing the service.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <h2>Access confirmed</h2>

              <p className="casa-sso__message">
                {message ?? "Secure access confirmed. Opening the service..."}
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <h2>Unable to continue</h2>

              <p className="casa-sso__message">
                {message ??
                  "CASA could not complete secure access to this service."}
              </p>
            </>
          )}
        </div>

        {status === "loading" && (
          <div className="casa-sso__progress">
            <div className="casa-sso__progress-bar" />
          </div>
        )}

        {status === "error" && onReturn && (
          <button type="button" className="casa-sso__button" onClick={onReturn}>
            Back to CASA Administration
          </button>
        )}

        <footer className="casa-sso__footer">
          <span className="casa-sso__secure-dot" />
          Secure access through CASA Administration
        </footer>
      </section>
    </main>
  );
}
