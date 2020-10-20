import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Technology } from "../services/portfolio.types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
      zIndex: 1,
      "& > * + *": {
        marginTop: theme.spacing(3),
      },
      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
      },
    },
    input: {
      "&::placeholder": {
        color: theme.palette.primary.main,
      },
    },
  })
);

export interface SearchBarProps {
  options: Technology[];
  setOptions: React.Dispatch<React.SetStateAction<Technology[] | null>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ options, setOptions }) => {
  const classes = useStyles();

  return (
    <div className={classes.root} color="primary">
      <Autocomplete
        multiple
        id="search"
        style={{ width: 350 }}
        options={options}
        onChange={(e, v) => {
          // @ts-ignore
          setOptions(v);
        }}
        getOptionLabel={(option) => option.title}
        defaultValue={[]}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              style: {
                color: "white",
              },
            }}
            InputLabelProps={{
              style: {
                color: "white",
              },
            }}
            label="Search Tech"
            placeholder="Technologies"
          />
        )}
      />
    </div>
  );
};

export default SearchBar;
