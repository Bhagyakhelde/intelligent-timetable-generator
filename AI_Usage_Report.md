# AI Usage Report

## 1. AI Tool Used

**Tool:** ChatGPT

AI assistance was used during the development of the Intelligent Timetable Generator prototype.

---

## 2. How AI Was Used

AI assistance was used for:

* Understanding and breaking down the business problem.
* Designing the initial prototype architecture.
* Planning the HTML, CSS, and JavaScript structure.
* Developing the timetable scheduling logic.
* Implementing faculty, classroom, division, and laboratory constraints.
* Identifying validation and edge cases.
* Improving the timetable distribution logic.
* Improving the user interface.
* Reviewing the generated timetable for conflicts and possible issues.
* Preparing project documentation.

---

## 3. Example Prompt Used

An example of the development prompt was:

> Build a one-day MVP for an intelligent college timetable generator using HTML, CSS and JavaScript. The system should support multiple divisions, subjects, faculty members and classrooms. It should prevent faculty, classroom and division conflicts, require laboratory rooms for laboratory subjects, distribute subjects across the week, and detect impossible constraints with clear error messages.

Additional prompts were used to debug and improve the scheduling behavior and user interface.

---

## 4. AI-Generated Components

AI assistance contributed to the initial implementation of:

* HTML page structure
* CSS styling
* JavaScript data handling
* Timetable generation algorithm
* Constraint validation
* Room allocation logic
* Timetable scoring/distribution logic
* Error handling
* UI status messages

The generated implementation was tested manually rather than being accepted without validation.

---

## 5. Issues Found During Validation

During testing, some issues were identified.

### Issue 1 — Subject Distribution

The initial scheduling approach could place too many classes close together instead of distributing them naturally across the working week.

**Action taken:** The scheduling logic was improved to consider subject repetition, daily load, gaps, and neighboring periods when selecting a slot.

### Issue 2 — Room Display/Input

An earlier version had an issue with room information being displayed incorrectly.

**Action taken:** The room input and display implementation was corrected and retested.

### Issue 3 — Constraint Validation

Additional validation was required for impossible scenarios.

**Action taken:** Explicit checks were added for:

* Missing laboratory rooms
* Excessive weekly periods
* Faculty conflicts
* Classroom conflicts
* Division conflicts

---

## 6. Validation Performed

The final prototype was manually tested using multiple scenarios.

### Laboratory Constraint Test

A laboratory subject was created without any laboratory room.

**Result:** The system correctly rejected the timetable and displayed:

> Impossible constraint: laboratory subjects exist, but no laboratory room is available.

### Capacity Constraint Test

A division was given 31 periods while only 30 periods were available.

**Result:** The system correctly displayed an impossible timetable error.

### Shared Faculty Test

The same faculty member was assigned subjects in two different divisions.

**Result:** The system generated the timetable without assigning the same faculty member to two divisions at the same day and period.

### Normal Generation Test

Multiple divisions, subjects, faculty members, classrooms, and laboratory rooms were configured.

**Result:** The timetable was successfully generated and the main constraints were validated.

---

## 7. Human Validation

AI-generated code and suggestions were not treated as automatically correct.

The application was:

* Run locally using Live Server.
* Tested with realistic timetable data.
* Tested with multiple divisions.
* Tested with shared faculty members.
* Tested with different room types.
* Tested with impossible constraints.
* Tested with excessive period requirements.
* Visually checked for timetable output and room assignment.

Problems identified during testing were used to refine the implementation.

---

## 8. Limitations Identified

The current prototype does not yet implement:

* Persistent database storage
* Faculty availability preferences
* Classroom capacity
* Advanced optimization/constraint solving
* Authentication
* PDF/Excel export

These were treated as future production improvements because the goal of this submission was to produce a working Round-1 prototype within the available development time.

---

## 9. Role of AI vs. Developer

AI was used as a development assistant for planning, coding, debugging, validation ideas, and documentation.

The implementation was manually run and tested against the assignment requirements. The final behavior was verified through actual test cases rather than relying only on AI-generated code.

The developer made the final decisions about the project scope, requirements, testing, and acceptance of the generated implementation.
