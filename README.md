# Intelligent Timetable Generator

A web-based prototype that automatically generates college timetables while respecting faculty, classroom, division, and laboratory constraints.

## Problem Understanding

Colleges need to create timetables across multiple divisions, subjects, faculty members, classrooms, and working periods without creating scheduling conflicts.

This application automates timetable generation and detects impossible scheduling requirements instead of producing an invalid timetable.

## Features

* Multiple division support
* Subject and faculty management
* Weekly period requirements
* Normal classroom support
* Laboratory classroom support
* Automatic timetable generation
* Faculty conflict prevention
* Classroom conflict prevention
* Division conflict prevention
* Laboratory requirement validation
* Timetable capacity validation
* Impossible-constraint detection
* Timetable summary
* Reset functionality
* Responsive user interface

## Technology

* HTML5
* CSS3
* JavaScript
* Visual Studio Code
* Live Server

The Round-1 prototype is a client-side application and does not require a backend or database.

## Architecture

```text
User Input
    ↓
HTML Interface
    ↓
JavaScript Validation
    ↓
Constraint-Based Scheduler
    ↓
Conflict Validation
    ↓
Generated Timetable
```

### Main Components

**index.html**

Provides the interface for entering divisions, subjects, faculty, classrooms, and timetable settings.

**style.css**

Provides the visual design, responsive layout, forms, timetable tables, status messages, and other UI elements.

**script.js**

Contains input handling, validation, timetable generation, room allocation, conflict detection, failure handling, and result display.

## Scheduling Approach

The application uses a constraint-based greedy scheduling approach.

Subjects are converted into individual required periods. For every period, the scheduler evaluates available day and period combinations.

A slot is valid only when:

1. The division is free.
2. The faculty member is free across all divisions.
3. A suitable classroom is available.
4. The classroom is not already occupied.
5. Laboratory subjects are assigned only to laboratory rooms.
6. The same subject is not unnecessarily placed in consecutive periods.

The scheduler scores possible slots and selects a suitable slot to distribute subjects across the working week.

Laboratory subjects and subjects with fewer suitable room choices receive higher scheduling priority.

## Hard Constraints

### Division Conflict

A division cannot have two subjects at the same day and period.

### Faculty Conflict

A faculty member cannot teach two divisions at the same day and period.

### Classroom Conflict

A classroom cannot be assigned to two divisions at the same day and period.

### Laboratory Requirement

A subject requiring a laboratory must be assigned to a laboratory room.

### Weekly Period Requirement

Every subject must receive its configured number of periods per week.

### Timetable Capacity

A division cannot require more periods than the available timetable capacity.

For example:

```text
5 working days × 6 periods = 30 available periods
```

If a division requires 31 periods, the application reports an impossible timetable.

## Validation and Failure Handling

### No Laboratory Available

If a laboratory subject exists but no laboratory room is available, the application reports:

```text
Impossible constraint: laboratory subjects exist, but no laboratory room is available.
```

### Excessive Period Requirement

If a division requires more periods than available, the application reports an appropriate scheduling error instead of generating an incomplete timetable.

## Intelligent Distribution

The scheduler attempts to produce a realistic timetable instead of simply filling the first available slots.

The scoring logic considers:

* Subject repetition on the same day
* Daily subject load
* Gaps between classes
* Neighboring periods
* Room availability
* Laboratory constraints

## Assumptions

* Faculty are assumed to be available during configured working periods unless already assigned elsewhere.
* Classroom capacity is not currently collected as an input.
* All divisions use the same working days and periods per day.
* Each subject has a fixed weekly period requirement.
* Rooms are classified as either Normal Room or Laboratory.
* Data is stored in the browser session and is not persisted in a database.

## Trade-offs

### Greedy Scheduling

The prototype uses a greedy constraint-based approach instead of a formal optimization solver.

**Advantages:**

* Fast
* Easy to understand
* Suitable for a prototype
* Easy to modify

**Trade-off:**

A greedy approach may fail to find a valid timetable in some complex cases even when a solution theoretically exists.

A production version could use a formal constraint programming or optimization solver.

### Client-Side Architecture

The prototype does not use a backend or database.

This keeps the Round-1 implementation simple and fast to deploy.

A production system could use a backend, database, authentication, and persistent timetable storage.

## Edge Cases Tested

The application handles:

* No divisions
* No subjects
* No classrooms
* Laboratory subject without a laboratory room
* Division requiring more periods than available
* Multiple divisions sharing faculty
* Multiple divisions sharing classrooms
* Different room requirements
* Resetting the application
* Multiple working days

## Testing

### Laboratory Constraint Test

A laboratory subject was created without a laboratory room.

**Result:** Passed. The system correctly rejected the schedule.

### Capacity Constraint Test

A division was given 31 periods with only 30 available periods.

**Result:** Passed. The system correctly reported the impossible timetable.

### Shared Faculty Test

The same faculty member was assigned subjects across two divisions.

**Result:** Passed. The system prevented simultaneous faculty assignments.

### Successful Generation Test

Multiple divisions, subjects, faculty members, normal rooms, and laboratory rooms were configured.

**Result:** Passed. The timetable was generated successfully and the main constraints were validated.

## How to Run

1. Open the project folder in Visual Studio Code.
2. Open `index.html`.
3. Right-click the file.
4. Select **Open with Live Server**.
5. Add divisions, subjects, faculty, and classrooms.
6. Configure working days and periods per day.
7. Click **Generate Timetables**.

No backend or database setup is required.

## Future Improvements

Possible production improvements include:

* Faculty availability preferences
* Classroom capacity constraints
* Faculty workload limits
* Break and lunch periods
* Preferred teaching periods
* Subject-specific preferred days
* Drag-and-drop timetable editing
* Database persistence
* Authentication
* PDF/Excel export
* Advanced constraint optimization
* Administrator dashboard

## Live Demo

https://intelligent-timetable-generator.vercel.app/
## Screenshots

### 1. Application Interface

![Application Interface](Screenshot%201.png)

### 2. Generated Timetable

![Generated Timetable](Screenshot%202.png)

### 3. Constraint Validation

![Constraint Validation](Screenshot%203.png)

## Source Code

https://github.com/Bhagyakhelde/intelligent-timetable-generator
