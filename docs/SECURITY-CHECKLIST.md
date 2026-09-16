# Anony Talk security checklist

Before releasing a change:

- [ ] Keep secrets in environment configuration rather than source files.
- [ ] Verify client code does not expose server-only credentials.
- [ ] Check authentication and authorization behavior for affected routes.
- [ ] Validate user-controlled input at trust boundaries.
- [ ] Confirm production configuration is not copied into development examples.
- [ ] Review the diff for accidental credential or private-data changes.
