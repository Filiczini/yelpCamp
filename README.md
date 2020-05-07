# Campiczini

### Main ROUTES
Name | Path | HTTP Verb | Purpose
------------ | ------------- | ------------- | -------------
INDEX | /campings | GET |  Display Index Page
New | /campings/new | GET | Display Form To Add Camping
Create | /campings | POST | Add New Camping To DB and redirect to INDEX
Show | /campings/:id | GET |  Shows Info About One Camping

### Comments ROUTES
Name | Path | HTTP Verb | Purpose
------------ | ------------- | ------------- | -------------
NEW | /campings/:id/comments/new | GET |  Display Form To Add Comment
Create | /campings/:id/comments | POST | Create a new comment

