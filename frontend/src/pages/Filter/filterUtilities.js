const updateFilterData = (e, setFilter) => {
  const { name, value } = e.target;

  switch (name) {
    case "color":
    case "size":
      setFilter((prev) => {
        let onWhichToBeModified = [...prev[name]];

        if (onWhichToBeModified.includes(value) == true) {
          onWhichToBeModified = onWhichToBeModified.filter(
            (presentValue) => value != presentValue
          );
        } else {
          onWhichToBeModified.push(value);
        }

        prev[name] = onWhichToBeModified;

        return prev;
      });
      break;
    case "price":
    // Same for price and discount that is why have not added break.
    case "discount":
      setFilter((prev) => ({
        ...prev,
        [name]: value,
      }));
      break;
    default:
      break;
  }
};

const filters = [
  {
    id: "color",
    name: "Color",
    options: [
      { value: "white", label: "White", checked: false },
      { value: "beige", label: "Beige", checked: false },
      { value: "blue", label: "Blue", checked: false },
      { value: "brown", label: "Brown", checked: false },
      { value: "green", label: "Green", checked: false },
      { value: "purple", label: "Purple", checked: false },
    ],
  },
  {
    id: "size",
    name: "Size",
    options: [
      { value: "S", label: "S", checked: false },
      { value: "M", label: "M", checked: false },
      { value: "L", label: "L", checked: false },
    ],
  },
];

export { updateFilterData, filters };
