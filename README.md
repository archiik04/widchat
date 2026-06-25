# WidChat – AI Learning Analytics Dashboard

WidChat is a premium, manager-facing enterprise analytics dashboard that incorporates a persistent AI workspace (similar to ChatGPT, Claude, and Notion AI). It enables L&D managers to monitor employee learning metrics and interactively query live datasets without losing state.

---

## 🚀 Key Features

### 1. Persistent State Management
- **Seamless Session Rehydration**: Selected widgets, open side panels, conversation logs, and draft inputs survive page refreshes and browser reloads without layout flashing.
- **Independent Context Streams**: Each analytics widget maintains its own isolated conversation history and draft inputs. Switching between widgets preserves and re-aligns their states instantly.
- **Debounced Scroll Preservation**: The application automatically tracks and restores your exact scrolling position inside the active chat thread.
- **Explicit Context Purging**: A **Clear Context** button lets users purge the browser storage cache and return the assistant to its first-visit onboarding state.

### 2. High-Fidelity Bento Grid Analytics Widgets
Four specialized widgets display live data metrics:
1. **Learning Progress**: Tracks completion rates with weekly SVG trend sparklines.
2. **Course Activity**: Summarizes peak hour learners and average sessions.
3. **Skill Development**: Identifies certifications and priority gaps.
4. **Employee Engagement**: Tracks quarterly retention streaks and average learning days.

### 3. Dynamic Selection Interactions
- **Context Chip Transition**: Clicking any card spawns a capsule representing the widget's label, theme color, and icon, which flies dynamically along a spring cubic bezier path and lands directly inside the assistant panel's target.
- **Interactive Chat Log**: Custom prompt keyword parsing generates structured widget recommendations, complete with embedded visual summary cards and operational buttons.
- **Bouncing-Dot Typing Indicator**: Emulates real-time processing lag during query processing.

---

## 🛠️ Installation & Setup

1. **Clone & Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Local Development Server**:
   ```bash
   npm run dev
   ```
   *The application will launch on [http://localhost:5173](http://localhost:5173)*

3. **Verify Build Compilation**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

- `src/App.tsx` - Core application component containing state rehydration logic, interactive chat handlers, visual components, layout markup, and Framer Motion spring configurations.
- `index.html` - Application entry point.
- `design.md` - Technical design documentation addressing selection indicators, context transfers, and visual rendering structures.
