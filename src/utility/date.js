const dateOptions = {
  day: "numeric",
  month: "short"
};

const monthYearOptions = {
  month: "long",
  year: "numeric"
};

const MonthDayTimeOption = {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit"
};

const monthDayYearOption = {
  month: "long",
  day: "numeric",
  year: "numeric"
};

export const convertToLocaleDate = (date) => {
  if (date.nanoseconds === 0) {
    return new Date(date.toDate()).toLocaleDateString(undefined, dateOptions);
  }

  if (typeof date === "string") {
    return new Date(
      date.toString().replace(/-/g, "/").replace(/T.+/, "")
    ).toLocaleDateString(undefined, dateOptions);
  } else {
    return new Date(date).toLocaleDateString(undefined, dateOptions);
  }
};

export const convertToMonthYear = (date) => {
  if (date.nanoseconds === 0) {
    return new Date(date.toDate()).toLocaleDateString(
      undefined,
      monthYearOptions
    );
  }
  if (typeof date === "string") {
    return new Date(
      date.toString().replace(/-/g, "/").replace(/T.+/, "")
    ).toLocaleDateString(undefined, monthYearOptions);
  } else {
    return new Date(date).toLocaleDateString(undefined, monthYearOptions);
  }
};

export const convertToMonthDayTime = (date) => {
  if (date.nanoseconds === 0) {
    return new Date(date.toDate()).toLocaleDateString(
      undefined,
      MonthDayTimeOption
    );
  }
  if (typeof date === "string") {
    return new Date(
      date.toString().replace(/-/g, "/").replace(/T.+/, "")
    ).toLocaleDateString(undefined, MonthDayTimeOption);
  } else {
    return new Date(date).toLocaleDateString(undefined, MonthDayTimeOption);
  }
};

export const convertToMonthDayYear = (date) => {
  if (date.nanoseconds === 0) {
    return new Date(date.toDate()).toLocaleDateString(
      undefined,
      monthDayYearOption
    );
  }
  if (typeof date === "string") {
    return new Date(
      date.toString().replace(/-/g, "/").replace(/T.+/, "")
    ).toLocaleDateString(undefined, monthDayYearOption);
  } else {
    return new Date(date).toLocaleDateString(undefined, monthDayYearOption);
  }
};
