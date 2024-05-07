const tabs = document.querySelectorAll('[data-tab-target]')
const tabContents = document.querySelectorAll('[data-tab-content]')

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.tabTarget)
        tabContents.forEach(tabContent => tabContent.classList.remove('active'))
        tabs.forEach(tab => tab.classList.remove('active'))
        tab.classList.add('active')
        target.classList.add('active')
    })
});

document.addEventListener('DOMContentLoaded', function () {
    function initializeToggle() {
        var toggle = document.querySelector(".toggle");
        toggle.addEventListener('click', function () {
            var menu = document.querySelector(".menu");
            menu.classList.toggle("active");
            var icon = toggle.querySelector("i");
            if (icon.classList.contains('bx-menu')) {
                icon.classList.remove('bx-menu');
                icon.classList.add('bx-x');
            } else {
                icon.classList.remove('bx-x');
                icon.classList.add('bx-menu');
            }
        });
    }

    initializeToggle();

});


document.addEventListener('DOMContentLoaded', function () {
    const calendar = document.querySelector(".calendar");
    const date = document.querySelector(".date");
    const daysContainer = document.querySelector(".days");
    const prev = document.querySelector(".prev");
    const next = document.querySelector(".next");
    const todayBtn = document.querySelector(".today-btn");
    const gotoBtn = document.querySelector(".goto-btn");
    const dateInput = document.querySelector(".date-input");
    const planDay = document.querySelector(".plan-day");
    const planDate = document.querySelector(".plan-date");
    const plansContainer = document.querySelector(".plans");
    const addPlanBtn = document.querySelector(".add-plan");
    const addPlanWrapper = document.querySelector(".add-plan-wrapper");
    const addPlanCloseBtn = document.querySelector(".close");
    const addPlanTitle = document.querySelector(".plan-name");
    const addPlanFrom = document.querySelector(".plan-time-from");
    const addPlanTo = document.querySelector(".plan-time-to");
    const addPlanSubmit = document.querySelector(".add-plan-btn");

    let today = new Date();
    let activeDay;
    let month = today.getMonth();
    let year = today.getFullYear();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const plansArr = [];
    getPlans();
    console.log(plansArr);

    function initCalendar() {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const prevLastDay = new Date(year, month, 0);
        const prevDays = prevLastDay.getDate();
        const lastDate = lastDay.getDate();
        const day = firstDay.getDay();
        const nextDays = 7 - lastDay.getDay() - 1;

        date.innerHTML = `${months[month]} ${year}`;

        let days = "";

        for (let x = day; x > 0; x--) {
            days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
        }

        for (let i = 1; i <= lastDate; i++) {
            let plan = false;
            plansArr.forEach((planObj) => {
                if (planObj.day === i && planObj.month === month + 1 && planObj.year === year) {
                    plan = true;
                }
            });
            if (i === new Date().getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) {
                activeDay = i;
                getActiveDay(i);
                updatePlans(i);
                days += plan ? `<div class="day today active plan">${i}</div>` : `<div class="day today active">${i}</div>`;
            } else {
                days += plan ? `<div class="day plan">${i}</div>` : `<div class="day">${i}</div>`;
            }
        }

        for (let j = 1; j <= nextDays; j++) {
            days += `<div class="day next-date">${j}</div>`;
        }
        daysContainer.innerHTML = days;
        addListener();
    }

    function prevMonth() {
        month--;
        if (month < 0) {
            month = 11;
            year--;
        }
        initCalendar();
    }

    function nextMonth() {
        month++;
        if (month > 11) {
            month = 0;
            year++;
        }
        initCalendar();
    }

    prev.addEventListener("click", prevMonth);
    next.addEventListener("click", nextMonth);

    initCalendar();

    function addListener() {
        const days = document.querySelectorAll(".day");
        days.forEach((day) => {
            day.addEventListener("click", (e) => {
                getActiveDay(e.target.innerHTML);
                updatePlans(Number(e.target.innerHTML));
                activeDay = Number(e.target.innerHTML);
                days.forEach((day) => {
                    day.classList.remove("active");
                });
                if (e.target.classList.contains("prev-date")) {
                    prevMonth();
                    setTimeout(() => {
                        const days = document.querySelectorAll(".day");
                        days.forEach((day) => {
                            if (!day.classList.contains("prev-date") && day.innerHTML === e.target.innerHTML) {
                                day.classList.add("active");
                            }
                        });
                    }, 100);
                } else if (e.target.classList.contains("next-date")) {
                    nextMonth();
                    setTimeout(() => {
                        const days = document.querySelectorAll(".day");
                        days.forEach((day) => {
                            if (!day.classList.contains("next-date") && day.innerHTML === e.target.innerHTML) {
                                day.classList.add("active");
                            }
                        });
                    }, 100);
                } else {
                    e.target.classList.add("active");
                }
            });
        });
    }

    todayBtn.addEventListener("click", () => {
        today = new Date();
        month = today.getMonth();
        year = today.getFullYear();
        initCalendar();
    });

    dateInput.addEventListener("input", (e) => {
        dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
        if (dateInput.value.length === 2) {
            dateInput.value += "/";
        }
        if (dateInput.value.length > 7) {
            dateInput.value = dateInput.value.slice(0, 7);
        }
        if (e.inputType === "deleteContentBackward") {
            if (dateInput.value.length === 3) {
                dateInput.value = dateInput.value.slice(0, 2);
            }
        }
    });

    if (gotoBtn) {
        gotoBtn.addEventListener("click", gotoDate);
    }

    function gotoDate() {
        console.log("here");
        const dateArr = dateInput.value.split("/");
        if (dateArr.length === 2) {
            if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
                month = dateArr[0] - 1;
                year = dateArr[1];
                initCalendar();
                return;
            }
        }
        alert("Invalid Date");
    }

    function getActiveDay(date) {
        const day = new Date(year, month, date);
        const dayName = day.toString().split(" ")[0];
        planDay.innerHTML = dayName;
        planDate.innerHTML = `${date} ${months[month]} ${year}`;
    }

    function updatePlans(date) {
        let plans = "";
        plansArr.forEach((plan) => {
            if (date === plan.day && month + 1 === plan.month && year === plan.year) {
                plan.plans.forEach((plan) => {
                    plans += `<div class="plan">
                        <div class="title">
                            <i class='bx bx-circle'></i>
                            <h3 class="plan-title">${plan.title}</h3>
                        </div>
                        <div class="plan-time">
                            <span class="plan-time">${plan.time}</span>
                        </div>
                    </div>`;
                });
            }
        });
        if (plans === "") {
            plans = `<div class="no-plan">
                <h3>No Plans</h3>
            </div>`;
        }
        plansContainer.innerHTML = plans;
        savePlans();
    }

    addPlanBtn.addEventListener("click", () => {
        addPlanWrapper.classList.toggle("active");
    });

    addPlanCloseBtn.addEventListener("click", () => {
        addPlanWrapper.classList.remove("active");
    });

    document.addEventListener("click", (e) => {
        if (e.target !== addPlanBtn && !addPlanWrapper.contains(e.target)) {
            addPlanWrapper.classList.remove("active");
        }
    });

    addPlanTitle.addEventListener("input", (e) => {
        addPlanTitle.value = addPlanTitle.value.slice(0, 60);
    });

    addPlanFrom.addEventListener("input", (e) => {
        addPlanFrom.value = addPlanFrom.value.replace(/[^0-9:]/g, "");
        if (addPlanFrom.value.length === 2) {
            addPlanFrom.value += ":";
        }
        if (addPlanFrom.value.length > 5) {
            addPlanFrom.value = addPlanFrom.value.slice(0, 5);
        }
    });

    addPlanTo.addEventListener("input", (e) => {
        addPlanTo.value = addPlanTo.value.replace(/[^0-9:]/g, "");
        if (addPlanTo.value.length === 2) {
            addPlanTo.value += ":";
        }
        if (addPlanTo.value.length > 5) {
            addPlanTo.value = addPlanTo.value.slice(0, 5);
        }
    });

    addPlanSubmit.addEventListener("click", () => {
        const planTitle = addPlanTitle.value;
        const planTimeFrom = addPlanFrom.value;
        const planTimeTo = addPlanTo.value;
        if (planTitle === "" || planTimeFrom === "" || planTimeTo === "") {
            alert("Please fill all the fields");
            return;
        }

        const timeFromArr = planTimeFrom.split(":");
        const timeToArr = planTimeTo.split(":");
        if (
            timeFromArr.length !== 2 ||
            timeToArr.length !== 2 ||
            timeFromArr[0] > 23 ||
            timeFromArr[1] > 59 ||
            timeToArr[0] > 23 ||
            timeToArr[1] > 59
        ) {
            alert("Invalid Time Format");
            return;
        }

        const timeFrom = convertTime(planTimeFrom);
        const timeTo = convertTime(planTimeTo);

        let planExist = false;
        plansArr.forEach((plan) => {
            if (plan.day === activeDay && plan.month === month + 1 && plan.year === year) {
                plan.plans.forEach((plan) => {
                    if (plan.title === planTitle) {
                        planExist = true;
                    }
                });
            }
        });
        if (planExist) {
            alert("Plan already added");
            return;
        }
        const newPlan = {
            title: planTitle,
            time: `${timeFrom} - ${timeTo}`,
        };
        console.log(newPlan);
        console.log(activeDay);
        let planAdded = false;
        if (plansArr.length > 0) {
            plansArr.forEach((item) => {
                if (item.day === activeDay && item.month === month + 1 && item.year === year) {
                    item.plans.push(newPlan);
                    planAdded = true;
                }
            });
        }

        if (!planAdded) {
            plansArr.push({
                day: activeDay,
                month: month + 1,
                year: year,
                plans: [newPlan],
            });
        }

        console.log(plansArr);
        addPlanWrapper.classList.remove("active");
        addPlanTitle.value = "";
        addPlanFrom.value = "";
        addPlanTo.value = "";
        updatePlans(activeDay);
        const activeDayEl = document.querySelector(".day.active");
        if (!activeDayEl.classList.contains("plan")) {
            activeDayEl.classList.add("plan");
        }
    });

    plansContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("plan")) {
            if (confirm("Are you sure you want to delete this plan?")) {
                const planTitle = e.target.children[0].children[1].innerHTML;
                plansArr.forEach((plan) => {
                    if (plan.day === activeDay && plan.month === month + 1 && plan.year === year) {
                        plan.plans.forEach((item, index) => {
                            if (item.title === planTitle) {
                                plan.plans.splice(index, 1);
                            }
                        });
                        if (plan.plans.length === 0) {
                            plansArr.splice(plansArr.indexOf(plan), 1);
                            const activeDayEl = document.querySelector(".day.active");
                            if (activeDayEl.classList.contains("plan")) {
                                activeDayEl.classList.remove("plan");
                            }
                        }
                    }
                });
                updatePlans(activeDay);
            }
        }
    });

    function savePlans() {
        localStorage.setItem("plans", JSON.stringify(plansArr));
    }

    function getPlans() {
        if (localStorage.getItem("plans") === null) {
            return;
        }
        plansArr.push(...JSON.parse(localStorage.getItem("plans")));
    }

    function convertTime(time) {
        let timeArr = time.split(":");
        let timeHour = timeArr[0];
        let timeMin = timeArr[1];
        let timeFormat = timeHour >= 12 ? "PM" : "AM";
        timeHour = timeHour % 12 || 12;
        time = `${timeHour}:${timeMin} ${timeFormat}`;
        return time;
    }
});

