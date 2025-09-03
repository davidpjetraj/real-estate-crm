import DateRange from "./DateRange";

import NumberRange from "./NumberRange";
import Search from "./Search";
import Select from "./Select";
import { SwitchFilter } from "./SwitchFilter";
import User from "./User";

export default function FilterType({ data, store }: any) {
  const type = data?.filterOptions?.type;

  if (type === "search") {
    return <Search data={data} store={store} />;
  } else if (type === "multiselect") {
    return <Select data={data} store={store} />;
  } else if (type === "date-range") {
    return <DateRange data={data} store={store} />;
  } else if (type === "number-range") {
    return <NumberRange data={data} store={store} />;
  } else if (type === "users") {
    return <User data={data} store={store} />;
  } else if (type === "switch") {
    return <SwitchFilter data={data} store={store} />;
  } else {
    return null;
  }
}
