# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - link "InvoiceQuickly" [ref=e5] [cursor=pointer]:
          - /url: /
          - img [ref=e6]
          - generic [ref=e9]: InvoiceQuickly
        - generic [ref=e10]:
          - link "My Invoices" [ref=e11] [cursor=pointer]:
            - /url: /dashboard
          - link "Settings" [ref=e12] [cursor=pointer]:
            - /url: /dashboard/settings
            - img [ref=e13]
          - button "Toggle theme" [ref=e16]:
            - img [ref=e17]
            - generic [ref=e23]: Toggle theme
          - button "Select language" [ref=e25]:
            - img [ref=e26]
            - generic [ref=e29]: Select language
          - button "User menu" [ref=e32]:
            - generic [ref=e34]: TU
    - main [ref=e35]:
      - img [ref=e37]
  - button "Open Next.js Dev Tools" [ref=e44] [cursor=pointer]:
    - img [ref=e45]
  - alert [ref=e48]
```