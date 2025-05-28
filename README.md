# IAS-
System Documentation: Incident Reporting and Response Platform

1.) Overview

This system is a web-based platform designed to handle incident reporting and security response workflows within an organization. It supports secure user authentication, role-based access control, incident tracking, and decision support via Business Impact Analysis (BIA).

2.) Features

User Authentication: Registration and login using Supabase Auth.

Custom Role Redirection: Redirects based on user role (admin or user).

Incident Reporting: Users can report incidents with impact level classification.

Incident Management (Admin): Admins can view, update status, and delete incidents.

Audit Trail: Shows who reported and last updated each incident.

Business Impact Recommendations: Dynamic recommendations based on selected impact level.

3.) Pages

A. index.html (Login Page)

Inputs: Email, Password

Actions: Authenticates and redirects based on role

B. register.html

Inputs: Email, Password

Actions: Creates a new user (role set manually in Supabase)

C. report.html

For regular users

Features a form to submit new incidents

Logout button included

D. admin.html

For admins

Displays all reported incidents

Admin can update status and delete incidents

BIA recommendations shown upon report submission

4.) JavaScript Logic (script.js)

signIn(): Authenticates and redirects based on app_metadata.role

signOut(): Logs out and redirects to login page

signUp(): Registers a new user

getCurrentUser(): Fetches logged-in user data

getUserRole(): Reads user role from metadata

loadIncidents(): Loads and displays incidents with audit data

updateStatus(): Updates incident status and tracks updater

deleteIncident(): Deletes incident (admin only)

generateBIARecommendation(): Displays BIA-based actions for impact levels

5.) Database Schema (incidents)

CREATE TABLE incidents (
  id bigint generated always as identity primary key,
  title text not null,
  description text not null,
  impact_level text not null,
  status text not null default 'Reported',
  reported_by text,
  updated_by text,
  created_at timestamp not null default now()
);

6.) Business Impact Logic

High: Isolate system, notify leadership, launch investigation

Moderate: Patch systems, train users, assess scope

Low: Monitor, log, review policies

7.) Future Enhancements

OTP/PIN verification

Role editor via frontend

Email notifications for high-impact incidents

Activity logs and timestamps

