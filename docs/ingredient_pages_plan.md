# Plan for New Ingredient Pages

This document outlines the plan to create new SEO-optimized ingredient pages for Acai Berry, Strawberry, Cranberry, and Raspberry.

## 1. Objective

The goal is to create new ingredient pages that are consistent with the existing page structure, optimized for search engines, and provide valuable information to users.

## 2. Scope

The following new ingredient pages will be created:
- Acai Berry
- Strawberry
- Cranberry
- Raspberry

## 3. Approach

The existing `beta-glucan-oat-bran` page will be used as a template for the new pages. The process for each ingredient will be as follows:

### 3.1. File and Folder Creation

A dedicated folder will be created for each ingredient inside `app/ingredients/`. Each folder will contain the following files:
- `page.tsx`: The main page component.
- `metadata.ts`: SEO metadata for the page.

A corresponding component file will also be created in `src/components/pages/ingredients/`.

### 3.2. Content and Metadata Generation

For each ingredient, unique and SEO-optimized content will be generated, including:
- **Metadata**: Page titles, descriptions, keywords, and Open Graph data.
- **Page Content**: A hero section, benefits, processing methods, scientific evidence, and nutritional composition.
- **Structured Data**: A `Schema.org` JSON-LD script for enhanced search engine visibility.

### 3.3. Component Structure

The new pages will use the same React components as the existing ingredient pages to ensure a consistent design and user experience.

## 4. File Structure Diagram

The following diagram illustrates the file structure for the new pages:

```mermaid
graph TD
    subgraph "Acai Berry"
        A1["app/ingredients/acai-berry/"]
        A1 --> A2["page.tsx"]
        A1 --> A3["metadata.ts"]
        A1 --> A4["src/components/pages/ingredients/AcaiBerry.tsx"]
    end

    subgraph "Strawberry"
        B1["app/ingredients/strawberry/"]
        B1 --> B2["page.tsx"]
        B1 --> B3["metadata.ts"]
        B1 --> B4["src/components/pages/ingredients/Strawberry.tsx"]
    end

    subgraph "Cranberry"
        C1["app/ingredients/cranberry/"]
        C1 --> C2["page.tsx"]
        C1 --> C3["metadata.ts"]
        C1 --> C4["src/components/pages/ingredients/Cranberry.tsx"]
    end

    subgraph "Raspberry"
        D1["app/ingredients/raspberry/"]
        D1 --> D2["page.tsx"]
        D1 --> D3["metadata.ts"]
        D1 --> D4["src/components/pages/ingredients/Raspberry.tsx"]
    end

    style A1 fill:#f9f,stroke:#333,stroke-width:2px
    style B1 fill:#f9f,stroke:#333,stroke-width:2px
    style C1 fill:#f9f,stroke:#333,stroke-width:2px
    style D1 fill:#f9f,stroke:#333,stroke-width:2px