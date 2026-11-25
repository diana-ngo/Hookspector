# Glossary

## Bin

A uniquely identified place that collects incoming HTTP requests from outside senders so they can be inspected later. Each Bin has its own capture URL, identified by an unguessable Bin ID that acts as the URL's only secret.

_Avoid:_ Inbox, Endpoint (when referring to the Bin itself)

## Captured Request

A single HTTP request that arrived at a Bin's capture URL, recorded as received: method, path, query, headers and raw body. A Captured Request belongs to exactly one Bin.

_Avoid:_ Webhook, Event, Request (unqualified, where it could be confused with the dashboard's own API calls)
