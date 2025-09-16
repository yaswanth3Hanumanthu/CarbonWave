### Onboarding Guide (NCCR, NGOs, Communities)

1) Roles
- NCCR Admin: manages registry, assigns verifiers, issues credits
- NGO: project owner, supplies MRV data
- Verifier: accredited third-party for attestations

2) Steps
- Create admin wallet; deploy contracts; record addresses
- Register NGO wallet as project owner via admin
- NGO submits project metadata (IPFS URI) and geohash via API
- Assign verifier(s); verifier uploads evidence URI via admin tool or app
- Admin issues credits post-verification

3) Data Submission
- Mobile app posts to `/projects/:id/data` with schema-compliant JSON
- Large media/maps uploaded to object store or IPFS; include URI references


