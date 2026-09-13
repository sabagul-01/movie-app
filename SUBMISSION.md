# Internship Assignment: React Application Built with AI Assistance

**Project Name:** CineScope (Movie Discovery App)  

**Technology Used:** React (Vite), JavaScript, TMDB API, Lucide Icons  

---

## 1. Application Overview

CineScope is a movie discovery web application that allows users to explore popular movies, live-search titles with debounced API queries, view release dates and ratings, and inspect movie details via an interactive modal view.

---

## 2. Prompts Used During Development

### Prompt 1: Initial Application Setup & Base UI

> **Prompt:** "Build a modern React Movie Discovery App in src/App.jsx using TMDB API key from import.meta.env.VITE_TMDB_API_KEY. Include a dark-themed header with app title and search input, popular movies grid displaying poster, title, release date, and rating, along with loading and error UI states."

### Prompt 2: Refactoring & Search Optimization

> **Prompt:** "Refactor src/App.jsx by extracting MovieCard and Header into separate components under src/components/. Implement a search debounce mechanism (500ms) to reduce API calls during typing, and add image fallbacks for missing movie posters."

---

## 3. How AI Assisted Throughout Implementation

* **Rapid Prototyping:** AI generated the initial boilerplate code, state management structures `useState`, `useEffect`), and initial TMDB API integration in seconds.

* **Component Extraction:** AI helped modularize monolithic layout code into reusable sub-components.

* **Styling Guidance:** Provided clean CSS patterns for responsive grid layouts and movie card hover effects.

---

## 4. Manual Improvements, Corrections, and Refactoring

### Improvement 1: Performance Optimization via Search Debouncing

* **AI Output:** The initial code triggered an API request on every character typed `onChange`), resulting in unnecessary network requests (e.g., typing "Batman" made 6 separate HTTP calls).

* **Manual Correction:** Added a custom `debouncedSearchTerm` state with a 500ms `setTimeout` cleanup function.

```javascript

// Manual Fix: Debounce search input to prevent API spam

const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

useEffect(() => {

  const timer = setTimeout(() => {

    setDebouncedSearchTerm(searchTerm);

  }, 500);

  return () => clearTimeout(timer);

}, [searchTerm]);