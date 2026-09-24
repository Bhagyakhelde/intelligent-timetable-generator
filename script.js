// ============================================================
// INTELLIGENT TIMETABLE GENERATOR
// Constraint-based scheduling prototype
// ============================================================


// ============================================================
// DATA
// ============================================================

let divisions = [];
let subjects = [];
let rooms = [];

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];


// ============================================================
// DIVISIONS
// ============================================================

function addDivision() {

    const input =
        document.getElementById("divisionName");

    const name =
        input.value.trim();


    if (!name) {

        showError(
            "Please enter a division name."
        );

        input.focus();

        return;
    }


    const duplicate =
        divisions.some(
            division =>
                division.toLowerCase() === name.toLowerCase()
        );


    if (duplicate) {

        showError(
            "This division already exists."
        );

        input.focus();

        return;
    }


    divisions.push(name);

    input.value = "";

    displayDivisions();

    updateDivisionDropdowns();

    clearMessage();
}


function displayDivisions() {

    const container =
        document.getElementById("divisionList");


    document.getElementById("divisionCount")
        .textContent = divisions.length;


    if (divisions.length === 0) {

        container.innerHTML = "";

        return;
    }


    container.innerHTML =
        divisions.map(
            (division, index) => `

                <div class="list-item">

                    <strong>
                        ${index + 1}.
                    </strong>

                    ${escapeHtml(division)}

                </div>

            `
        ).join("");
}


function updateDivisionDropdowns() {

    const select =
        document.getElementById("subjectDivision");


    select.innerHTML =
        `<option value="">Select Division</option>`;


    divisions.forEach(division => {

        const option =
            document.createElement("option");

        option.value = division;

        option.textContent = division;

        select.appendChild(option);

    });
}


// ============================================================
// SUBJECTS
// ============================================================

function addSubject() {

    const division =
        document.getElementById("subjectDivision").value;

    const name =
        document.getElementById("subjectName")
            .value.trim();

    const faculty =
        document.getElementById("facultyName")
            .value.trim();

    const periods =
        Number(
            document.getElementById("periods").value
        );

    const roomType =
        document.getElementById("roomType").value;


    if (!division) {

        showError(
            "Please select a division."
        );

        return;
    }


    if (!name) {

        showError(
            "Please enter a subject name."
        );

        return;
    }


    if (!faculty) {

        showError(
            "Please enter the faculty name."
        );

        return;
    }


    if (!Number.isInteger(periods) || periods < 1) {

        showError(
            "Periods per week must be a whole number greater than 0."
        );

        return;
    }


    const duplicate =
        subjects.some(
            subject =>
                subject.division.toLowerCase() ===
                division.toLowerCase() &&

                subject.name.toLowerCase() ===
                name.toLowerCase()
        );


    if (duplicate) {

        showError(
            `The subject "${name}" already exists for ${division}.`
        );

        return;
    }


    subjects.push({

        id: Date.now() +
            Math.floor(Math.random() * 10000),

        division,

        name,

        faculty,

        periods,

        roomType

    });


    document.getElementById("subjectName")
        .value = "";

    document.getElementById("facultyName")
        .value = "";

    document.getElementById("periods")
        .value = "";


    displaySubjects();

    clearMessage();
}


function displaySubjects() {

    const container =
        document.getElementById("subjectList");


    document.getElementById("subjectCount")
        .textContent = subjects.length;


    if (subjects.length === 0) {

        container.innerHTML = "";

        return;
    }


    container.innerHTML =
        subjects.map(
            (subject, index) => {

                const isLab =
                    subject.roomType === "lab";


                return `

                    <div class="list-item">

                        <strong>
                            ${index + 1}.
                            ${escapeHtml(subject.name)}
                        </strong>

                        <span>
                            — ${escapeHtml(subject.division)}
                        </span>

                        <span>
                            — Faculty:
                            ${escapeHtml(subject.faculty)}
                        </span>

                        <span>
                            — ${subject.periods} periods/week
                        </span>

                        <span class="
                            badge
                            ${isLab
                        ? "badge-lab"
                        : "badge-normal"}
                        ">
                            ${isLab
                        ? "LABORATORY"
                        : "NORMAL ROOM"}
                        </span>

                    </div>

                `;
            }
        ).join("");
}


// ============================================================
// ROOMS
// ============================================================

function addRoom() {

    const input =
        document.getElementById("roomNumber");

    const roomNumber =
        input.value.trim();


    const category =
        document.getElementById("roomCategory").value;


    if (!roomNumber) {

        showError(
            "Please enter a room number."
        );

        input.focus();

        return;
    }


    const duplicate =
        rooms.some(
            room =>
                room.number.toLowerCase() ===
                roomNumber.toLowerCase()
        );


    if (duplicate) {

        showError(
            `Room "${roomNumber}" already exists.`
        );

        input.focus();

        return;
    }


    rooms.push({

        id: Date.now() +
            Math.floor(Math.random() * 10000),

        number: roomNumber,

        category

    });


    input.value = "";

    input.focus();


    displayRooms();

    clearMessage();
}


function displayRooms() {

    const container =
        document.getElementById("roomList");


    document.getElementById("roomCount")
        .textContent = rooms.length;


    if (rooms.length === 0) {

        container.innerHTML = "";

        return;
    }


    container.innerHTML =
        rooms.map(
            (room, index) => {

                const isLab =
                    room.category === "lab";


                return `

                    <div class="list-item">

                        <strong>
                            ${index + 1}.
                        </strong>

                        <span>
                            Room:
                            <strong>
                                ${escapeHtml(room.number)}
                            </strong>
                        </span>

                        <span class="
                            badge
                            ${isLab
                        ? "badge-lab"
                        : "badge-normal"}
                        ">
                            ${isLab
                        ? "LABORATORY"
                        : "NORMAL ROOM"}
                        </span>

                    </div>

                `;
            }
        ).join("");
}


// ============================================================
// GENERATE TIMETABLE
// ============================================================

function generateTimetables() {

    clearMessage();

    document.getElementById("summary").innerHTML = "";


    // --------------------------------------------------------
    // Basic validation
    // --------------------------------------------------------

    if (divisions.length === 0) {

        showError(
            "Please add at least one division."
        );

        return;
    }


    if (subjects.length === 0) {

        showError(
            "Please add at least one subject."
        );

        return;
    }


    if (rooms.length === 0) {

        showError(
            "Please add at least one classroom."
        );

        return;
    }


    const workingDayCount =
        Number(
            document.getElementById("workingDays").value
        );


    const periodsPerDay =
        Number(
            document.getElementById("periodsPerDay").value
        );


    const activeDays =
        days.slice(0, workingDayCount);


    const totalSlots =
        workingDayCount * periodsPerDay;


    // --------------------------------------------------------
    // Check laboratory availability
    // --------------------------------------------------------

    const labRooms =
        rooms.filter(
            room => room.category === "lab"
        );


    const labSubjects =
        subjects.filter(
            subject => subject.roomType === "lab"
        );


    if (
        labSubjects.length > 0 &&
        labRooms.length === 0
    ) {

        showError(
            "Impossible constraint: laboratory subjects exist, " +
            "but no laboratory room is available."
        );

        return;
    }


    // --------------------------------------------------------
    // Global resource schedules
    //
    // These are shared across all divisions.
    //
    // Therefore:
    // Faculty cannot teach two divisions simultaneously.
    // A classroom cannot host two divisions simultaneously.
    // --------------------------------------------------------

    const facultySchedule = {};

    const roomSchedule = {};


    const results = [];


    // ========================================================
    // GENERATE ONE TIMETABLE FOR EACH DIVISION
    // ========================================================

    for (const division of divisions) {

        const divisionSubjects =
            subjects.filter(
                subject =>
                    subject.division === division
            );


        if (divisionSubjects.length === 0) {

            showError(
                `Division "${division}" has no subjects.`
            );

            return;
        }


        // ----------------------------------------------------
        // Capacity check
        // ----------------------------------------------------

        const requiredPeriods =
            divisionSubjects.reduce(
                (total, subject) =>
                    total + subject.periods,
                0
            );


        if (requiredPeriods > totalSlots) {

            showError(
                `Impossible timetable for ${division}. ` +
                `The division requires ${requiredPeriods} periods, ` +
                `but only ${totalSlots} periods are available.`
            );

            return;
        }


        // ----------------------------------------------------
        // Empty timetable
        // ----------------------------------------------------

        const timetable =
            Array.from(
                {
                    length: workingDayCount
                },
                () =>
                    Array(periodsPerDay)
                        .fill(null)
            );


        // ----------------------------------------------------
        // Track how many times each subject appears per day.
        // ----------------------------------------------------

        const subjectDayCount = {};


        divisionSubjects.forEach(subject => {

            subjectDayCount[subject.id] = {};

            for (
                let d = 0;
                d < workingDayCount;
                d++
            ) {

                subjectDayCount[subject.id][d] = 0;

            }

        });


        // ----------------------------------------------------
        // Create individual class instances.
        //
        // Example:
        // Java 4 periods becomes:
        // Java #1
        // Java #2
        // Java #3
        // Java #4
        // ----------------------------------------------------

        const instances = [];


        divisionSubjects.forEach(subject => {

            for (
                let i = 0;
                i < subject.periods;
                i++
            ) {

                instances.push({

                    subject,

                    number: i + 1

                });

            }

        });


        // ----------------------------------------------------
        // Schedule difficult resources first.
        //
        // Labs first because fewer rooms usually exist.
        // Subjects with fewer suitable resources are prioritized.
        // ----------------------------------------------------

        instances.sort(
            (a, b) => {

                const aDifficulty =
                    getSubjectDifficulty(
                        a.subject
                    );

                const bDifficulty =
                    getSubjectDifficulty(
                        b.subject
                    );


                if (
                    aDifficulty !==
                    bDifficulty
                ) {

                    return bDifficulty -
                        aDifficulty;

                }


                return (
                    b.subject.periods -
                    a.subject.periods
                );

            }
        );


        // ====================================================
        // PLACE EACH CLASS INSTANCE
        // ====================================================

        for (const instance of instances) {

            const subject =
                instance.subject;


            const possibleSlots = [];


            // ------------------------------------------------
            // Search every possible day and period.
            // ------------------------------------------------

            for (
                let d = 0;
                d < workingDayCount;
                d++
            ) {

                for (
                    let p = 0;
                    p < periodsPerDay;
                    p++
                ) {


                    // ----------------------------------------
                    // Division conflict
                    // ----------------------------------------

                    if (
                        timetable[d][p] !== null
                    ) {

                        continue;

                    }


                    // ----------------------------------------
                    // Faculty conflict
                    // ----------------------------------------

                    const facultyKey =
                        createFacultyKey(
                            subject.faculty,
                            d,
                            p
                        );


                    if (
                        facultySchedule[facultyKey]
                    ) {

                        continue;

                    }


                    // ----------------------------------------
                    // Same subject consecutive check
                    // ----------------------------------------

                    if (
                        hasSameSubjectAdjacent(
                            timetable,
                            subject,
                            d,
                            p,
                            periodsPerDay
                        )
                    ) {

                        continue;

                    }


                    // ----------------------------------------
                    // Find a free suitable room
                    // ----------------------------------------

                    const room =
                        findAvailableRoom(
                            subject,
                            d,
                            p,
                            roomSchedule
                        );


                    if (!room) {

                        continue;

                    }


                    // ----------------------------------------
                    // Valid slot
                    // ----------------------------------------

                    possibleSlots.push({

                        day: d,

                        period: p,

                        room

                    });

                }

            }


            // ------------------------------------------------
            // No possible slot
            // ------------------------------------------------

            if (
                possibleSlots.length === 0
            ) {

                const reason =
                    getFailureReason(
                        subject,
                        division,
                        timetable,
                        workingDayCount,
                        periodsPerDay,
                        facultySchedule,
                        roomSchedule
                    );


                showError(reason);

                return;
            }


            // ------------------------------------------------
            // Score every possible slot.
            //
            // Lower score = better slot.
            //
            // Goals:
            // 1. Spread subjects across days.
            // 2. Avoid unnecessary gaps.
            // 3. Avoid overloading one day.
            // 4. Prefer balanced period positions.
            // ------------------------------------------------

            possibleSlots.forEach(
                slot => {

                    slot.score =
                        calculateSlotScore(
                            timetable,
                            subject,
                            slot.day,
                            slot.period,
                            periodsPerDay,
                            subjectDayCount
                        );

                }
            );


            // Lowest score first.

            possibleSlots.sort(
                (a, b) =>
                    a.score - b.score
            );


            // ------------------------------------------------
            // Choose best slot.
            // ------------------------------------------------

            const chosen =
                possibleSlots[0];


            // ------------------------------------------------
            // Add class to timetable.
            // ------------------------------------------------

            timetable[
                chosen.day
            ][
                chosen.period
            ] = {

                subject,

                room: chosen.room

            };


            // ------------------------------------------------
            // Reserve faculty.
            // ------------------------------------------------

            const facultyKey =
                createFacultyKey(
                    subject.faculty,
                    chosen.day,
                    chosen.period
                );


            facultySchedule[facultyKey] =
                true;


            // ------------------------------------------------
            // Reserve room.
            // ------------------------------------------------

            const roomKey =
                createRoomKey(
                    chosen.room.id,
                    chosen.day,
                    chosen.period
                );


            roomSchedule[roomKey] =
                true;


            // ------------------------------------------------
            // Track subject day usage.
            // ------------------------------------------------

            subjectDayCount[
                subject.id
            ][
                chosen.day
            ]++;

        }


        // ----------------------------------------------------
        // Save completed division timetable.
        // ----------------------------------------------------

        results.push({

            division,

            timetable

        });

    }


    // ========================================================
    // FINAL VALIDATION
    // ========================================================

    const validation =
        validateGeneratedTimetables(
            results,
            activeDays,
            periodsPerDay
        );


    if (!validation.valid) {

        showError(
            "Timetable validation failed: " +
            validation.message
        );

        return;
    }


    // ========================================================
    // DISPLAY RESULTS
    // ========================================================

    displaySummary(
        results,
        activeDays,
        periodsPerDay
    );


    displayAllTimetables(
        results,
        activeDays,
        periodsPerDay
    );


    showSuccess(
        "Timetables generated successfully. " +
        "Faculty, classroom, division and laboratory constraints were validated."
    );
}


// ============================================================
// SUBJECT DIFFICULTY
// ============================================================

function getSubjectDifficulty(subject) {

    let score = 0;


    if (
        subject.roomType === "lab"
    ) {

        score += 100;

    }


    const suitableRoomCount =
        rooms.filter(
            room => {

                if (
                    subject.roomType === "lab"
                ) {

                    return room.category === "lab";

                }

                return room.category === "normal";

            }
        ).length;


    // Fewer rooms = more difficult.

    if (
        suitableRoomCount === 1
    ) {

        score += 50;

    } else if (
        suitableRoomCount === 2
    ) {

        score += 20;

    }


    return score;
}


// ============================================================
// SLOT SCORING
// ============================================================

function calculateSlotScore(
    timetable,
    subject,
    day,
    period,
    periodsPerDay,
    subjectDayCount
) {

    let score = 0;


    // --------------------------------------------------------
    // Strongly prefer spreading a subject across days.
    // --------------------------------------------------------

    const sameSubjectToday =
        subjectDayCount[
        subject.id
        ][day];


    score +=
        sameSubjectToday * 80;


    // --------------------------------------------------------
    // Prefer days with fewer classes.
    // --------------------------------------------------------

    const dayLoad =
        getDayLoad(
            timetable,
            day
        );


    score +=
        dayLoad * 18;


    // --------------------------------------------------------
    // Penalize gaps created by the slot.
    // --------------------------------------------------------

    score +=
        calculateGapPenalty(
            timetable,
            day,
            period
        );


    // --------------------------------------------------------
    // Prefer middle periods slightly.
    // --------------------------------------------------------

    const middle =
        (periodsPerDay - 1) / 2;


    score +=
        Math.abs(period - middle) * 1.5;


    // --------------------------------------------------------
    // Prefer slots adjacent to an existing class.
    //
    // This makes the timetable more compact.
    // --------------------------------------------------------

    const hasPrevious =
        period > 0 &&
        timetable[day][period - 1] !== null;


    const hasNext =
        period < periodsPerDay - 1 &&
        timetable[day][period + 1] !== null;


    if (
        hasPrevious ||
        hasNext
    ) {

        score -= 12;

    }


    return score;
}


// ============================================================
// GAP PENALTY
// ============================================================

function calculateGapPenalty(
    timetable,
    day,
    period
) {

    const occupied =
        timetable[day];


    let penalty = 0;


    // Example:
    // Class | Free | Class
    //
    // Adding another class in the middle
    // removes a gap, so it gets a better score.

    if (
        period > 0 &&
        period < occupied.length - 1
    ) {

        const before =
            occupied[period - 1] !== null;

        const after =
            occupied[period + 1] !== null;


        if (
            before &&
            after
        ) {

            penalty -= 25;

        }

    }


    // Creating a gap between classes is discouraged.

    if (
        period > 0 &&
        occupied[period - 1] === null
    ) {

        const earlierClass =
            occupied
                .slice(0, period)
                .some(
                    slot => slot !== null
                );


        if (earlierClass) {

            penalty += 20;

        }

    }


    return penalty;
}


// ============================================================
// ADJACENT SUBJECT CHECK
// ============================================================

function hasSameSubjectAdjacent(
    timetable,
    subject,
    day,
    period,
    periodsPerDay
) {

    if (
        period > 0 &&
        timetable[day][period - 1] &&
        timetable[day][period - 1]
            .subject.id === subject.id
    ) {

        return true;

    }


    if (
        period < periodsPerDay - 1 &&
        timetable[day][period + 1] &&
        timetable[day][period + 1]
            .subject.id === subject.id
    ) {

        return true;

    }


    return false;
}


// ============================================================
// FIND AVAILABLE ROOM
// ============================================================

function findAvailableRoom(
    subject,
    day,
    period,
    roomSchedule
) {

    const suitableRooms =
        rooms.filter(
            room => {

                if (
                    subject.roomType === "lab"
                ) {

                    return room.category === "lab";

                }

                return room.category === "normal";

            }
        );


    for (
        const room of suitableRooms
    ) {

        const key =
            createRoomKey(
                room.id,
                day,
                period
            );


        if (
            !roomSchedule[key]
        ) {

            return room;

        }

    }


    return null;
}


// ============================================================
// KEY HELPERS
// ============================================================

function normalizeName(value) {

    return String(value)
        .trim()
        .toLowerCase();

}


function createFacultyKey(
    faculty,
    day,
    period
) {

    return (
        normalizeName(faculty) +
        "|" +
        day +
        "|" +
        period
    );

}


function createRoomKey(
    roomId,
    day,
    period
) {

    return (
        roomId +
        "|" +
        day +
        "|" +
        period
    );

}


// ============================================================
// DAY LOAD
// ============================================================

function getDayLoad(
    timetable,
    day
) {

    return timetable[day]
        .filter(
            slot => slot !== null
        )
        .length;

}


// ============================================================
// FAILURE REASON
// ============================================================

function getFailureReason(
    subject,
    division,
    timetable,
    workingDayCount,
    periodsPerDay,
    facultySchedule,
    roomSchedule
) {

    const suitableRooms =
        rooms.filter(
            room => {

                if (
                    subject.roomType === "lab"
                ) {

                    return room.category === "lab";

                }

                return room.category === "normal";

            }
        );


    if (
        suitableRooms.length === 0
    ) {

        return (
            `Unable to schedule "${subject.name}" ` +
            `for ${division}: no suitable ` +
            `${subject.roomType === "lab"
                ? "laboratory"
                : "normal"} room exists.`
        );

    }


    const possibleFacultySlots = [];


    for (
        let d = 0;
        d < workingDayCount;
        d++
    ) {

        for (
            let p = 0;
            p < periodsPerDay;
            p++
        ) {

            const key =
                createFacultyKey(
                    subject.faculty,
                    d,
                    p
                );


            if (
                !facultySchedule[key] &&
                timetable[d][p] === null
            ) {

                possibleFacultySlots.push(
                    [d, p]
                );

            }

        }

    }


    if (
        possibleFacultySlots.length === 0
    ) {

        return (
            `Unable to schedule "${subject.name}" ` +
            `for ${division}: faculty "${subject.faculty}" ` +
            `is unavailable in all remaining slots.`
        );

    }


    return (
        `Unable to schedule "${subject.name}" ` +
        `for ${division}: all remaining slots are blocked ` +
        `by classroom, faculty or timetable constraints. ` +
        `Try adding rooms, increasing working periods, ` +
        `or reducing weekly periods.`
    );
}


// ============================================================
// VALIDATE FINAL TIMETABLE
// ============================================================

function validateGeneratedTimetables(
    results,
    activeDays,
    periodsPerDay
) {

    const facultyUsage = {};

    const roomUsage = {};


    for (
        const result of results
    ) {

        for (
            let d = 0;
            d < activeDays.length;
            d++
        ) {

            for (
                let p = 0;
                p < periodsPerDay;
                p++
            ) {

                const slot =
                    result.timetable[d][p];


                if (!slot) {

                    continue;

                }


                const subject =
                    slot.subject;

                const room =
                    slot.room;


                // --------------------------------------------
                // Faculty validation
                // --------------------------------------------

                const facultyKey =
                    createFacultyKey(
                        subject.faculty,
                        d,
                        p
                    );


                if (
                    facultyUsage[facultyKey]
                ) {

                    return {

                        valid: false,

                        message:
                            `Faculty conflict detected for ` +
                            `${subject.faculty}.`

                    };

                }


                facultyUsage[facultyKey] =
                    true;


                // --------------------------------------------
                // Room validation
                // --------------------------------------------

                const roomKey =
                    createRoomKey(
                        room.id,
                        d,
                        p
                    );


                if (
                    roomUsage[roomKey]
                ) {

                    return {

                        valid: false,

                        message:
                            `Room conflict detected for ` +
                            `${room.number}.`

                    };

                }


                roomUsage[roomKey] =
                    true;


                // --------------------------------------------
                // Lab validation
                // --------------------------------------------

                if (
                    subject.roomType === "lab" &&
                    room.category !== "lab"
                ) {

                    return {

                        valid: false,

                        message:
                            `${subject.name} requires a laboratory ` +
                            `but was assigned ${room.number}.`

                    };

                }


                // --------------------------------------------
                // Normal room validation
                // --------------------------------------------

                if (
                    subject.roomType === "normal" &&
                    room.category !== "normal"
                ) {

                    return {

                        valid: false,

                        message:
                            `${subject.name} requires a normal room ` +
                            `but was assigned ${room.number}.`

                    };

                }

            }

        }

    }


    return {
        valid: true
    };
}


// ============================================================
// DISPLAY SUMMARY
// ============================================================

function displaySummary(
    results,
    activeDays,
    periodsPerDay
) {

    let totalScheduled = 0;

    let totalFree = 0;


    results.forEach(
        result => {

            result.timetable.forEach(
                day => {

                    day.forEach(
                        slot => {

                            if (slot) {

                                totalScheduled++;

                            } else {

                                totalFree++;

                            }

                        }
                    );

                }
            );

        }
    );


    document.getElementById("summary")
        .innerHTML = `

            <div class="summary-grid">

                <div class="summary-item">

                    <span class="summary-number">
                        ${results.length}
                    </span>

                    <span class="summary-label">
                        Divisions
                    </span>

                </div>


                <div class="summary-item">

                    <span class="summary-number">
                        ${subjects.length}
                    </span>

                    <span class="summary-label">
                        Subjects
                    </span>

                </div>


                <div class="summary-item">

                    <span class="summary-number">
                        ${totalScheduled}
                    </span>

                    <span class="summary-label">
                        Scheduled Classes
                    </span>

                </div>


                <div class="summary-item">

                    <span class="summary-number">
                        ${totalFree}
                    </span>

                    <span class="summary-label">
                        Free Slots
                    </span>

                </div>

            </div>

        `;
}


// ============================================================
// DISPLAY TIMETABLES
// ============================================================

function displayAllTimetables(
    results,
    activeDays,
    periodsPerDay
) {

    const container =
        document.getElementById(
            "timetableOutput"
        );


    let html = "";


    results.forEach(
        result => {

            html += `

                <div class="timetable-container">

                    <h3 class="division-title">

                        ${escapeHtml(
                result.division
            )}

                    </h3>


                    <div class="table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Day
                                    </th>

            `;


            for (
                let p = 1;
                p <= periodsPerDay;
                p++
            ) {

                html += `

                    <th>
                        Period ${p}
                    </th>

                `;

            }


            html += `

                                </tr>

                            </thead>


                            <tbody>

            `;


            activeDays.forEach(
                (day, dayIndex) => {

                    html += `

                        <tr>

                            <th>
                                ${day}
                            </th>

                    `;


                    for (
                        let p = 0;
                        p < periodsPerDay;
                        p++
                    ) {

                        const slot =
                            result.timetable[
                            dayIndex
                            ][p];


                        if (!slot) {

                            html += `

                                <td>

                                    <span class="free">
                                        Free
                                    </span>

                                </td>

                            `;

                        } else {

                            html += `

                                <td>

                                    <span class="subject-cell">

                                        ${escapeHtml(
                                slot.subject.name
                            )}

                                    </span>


                                    <span class="faculty">

                                        Faculty:
                                        ${escapeHtml(
                                slot.subject.faculty
                            )}

                                    </span>


                                    <span class="room">

                                        Room:
                                        ${escapeHtml(
                                slot.room.number
                            )}

                                    </span>

                                </td>

                            `;

                        }

                    }


                    html += `

                        </tr>

                    `;

                }
            );


            html += `

                            </tbody>

                        </table>

                    </div>

                </div>

            `;

        }
    );


    container.innerHTML = html;
}


// ============================================================
// RESET
// ============================================================

function resetApplication() {

    const confirmed =
        confirm(
            "Reset everything and start again?"
        );


    if (!confirmed) {

        return;

    }


    divisions = [];

    subjects = [];

    rooms = [];


    document.getElementById(
        "divisionName"
    ).value = "";


    document.getElementById(
        "subjectName"
    ).value = "";


    document.getElementById(
        "facultyName"
    ).value = "";


    document.getElementById(
        "periods"
    ).value = "";


    document.getElementById(
        "roomNumber"
    ).value = "";


    displayDivisions();

    displaySubjects();

    displayRooms();

    updateDivisionDropdowns();


    document.getElementById(
        "summary"
    ).innerHTML = "";


    document.getElementById(
        "timetableOutput"
    ).innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">
                📅
            </div>

            <h3>
                No timetable generated yet
            </h3>

            <p>
                Add divisions, subjects and classrooms,
                then generate the timetable.
            </p>

        </div>

    `;


    clearMessage();
}


// ============================================================
// MESSAGES
// ============================================================

function showError(message) {

    document.getElementById(
        "message"
    ).innerHTML = `

        <div class="error">

            <strong>
                Scheduling Error
            </strong>

            <br>

            ${escapeHtml(message)}

        </div>

    `;
}


function showSuccess(message) {

    document.getElementById(
        "message"
    ).innerHTML = `

        <div class="success">

            ✓ ${escapeHtml(message)}

        </div>

    `;
}


function clearMessage() {

    document.getElementById(
        "message"
    ).innerHTML = "";

}


// ============================================================
// SAFE HTML OUTPUT
// ============================================================

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ============================================================
// INITIAL UI
// ============================================================

displayDivisions();

displaySubjects();

displayRooms();

updateDivisionDropdowns();