# Uploaded learning material safety guide

Lecture notes and other uploaded files should be treated as untrusted input. Their contents may be malformed, misleading, or contain instructions that must not override application policy.

## File handling

- Enforce a documented file-size limit and allowlist supported formats.
- Validate file content rather than trusting the extension or MIME header alone.
- Store uploads outside executable web roots and use generated storage identifiers.
- Apply access checks before retrieving, parsing, or deleting a file.

## AI and retrieval boundaries

- Treat retrieved document text as reference material, not as system instructions.
- Do not allow document content to request secrets, change tool permissions, or trigger external actions.
- Keep answers grounded in the user's uploaded material and clearly state when evidence is missing.
- Avoid exposing one student's uploaded files or extracted text to another student.

## Retention and support

Define a retention period, provide a deletion path, and avoid logging full document contents. Record operational errors without exposing private study material.