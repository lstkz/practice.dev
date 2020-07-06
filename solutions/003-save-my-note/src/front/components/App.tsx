import React from 'react';
import '../styles.css';

const API_URL = '/api';

export default function App() {
  const noteRef = React.useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  return (
    <div className="main-content">
      <h1>Save my note</h1>
      <div className="textbox" data-test="note">
        <input placeholder="Enter note..." type="text" ref={noteRef} />
      </div>
      <div className="buttons">
        <button
          disabled={isSaving}
          data-test="save-btn"
          className="btn btn-primary btn-save"
          onClick={async () => {
            setIsSaving(true);
            await fetch(API_URL + '/note', {
              method: 'POST',
              body: JSON.stringify({ note: noteRef.current.value || '' }),
              headers: {
                'content-type': 'application/json',
              },
            });
            setIsSaving(false);
          }}
        >
          Save
        </button>
        <button
          disabled={isSaving}
          data-test="load-btn"
          className="btn btn-primary btn-load"
          onClick={async () => {
            setIsSaving(true);
            const res = await fetch(API_URL + '/note');
            const body = await res.json();
            noteRef.current.value = body.note;
            setIsSaving(false);
          }}
        >
          Load
        </button>
      </div>
    </div>
  );
}
