#! /bin/bash
PSQL="psql -X --username=freecodecamp --dbname=periodic_table --tuples-only -c"

# check only 1 argument is passed
if [[ -z $1 ]] 
then
  # if no, or mulitple, arguments provide message to users and end script
  echo -e "Please provide an element as an argument."
else 
  # check argument passed is an integer (atomic number)
  if [[ $1 =~ ^[1-9]+$ ]] 
  then
    # integer passed, get element data from database from atomic number
    SELECTED_ELEMENT=$($PSQL "SELECT atomic_number, name, symbol, type, atomic_mass, melting_point_celsius, boiling_point_celsius FROM elements JOIN properties USING(atomic_number) JOIN types USING(type_id) WHERE atomic_number=$1")
  else 
    # string passed, get element data from database from element name or symbol
    SELECTED_ELEMENT=$($PSQL "SELECT atomic_number, name, symbol, type, atomic_mass, melting_point_celsius, boiling_point_celsius FROM elements JOIN properties USING(atomic_number) JOIN types USING(type_id) WHERE name='$1' or symbol='$1'")
  fi

  # check if element is in database
  if [[ -z $SELECTED_ELEMENT ]] 
  then
    # if not in database
    echo -e "I could not find that element in the database."
  else 
    # format output from selected element data
    echo "$SELECTED_ELEMENT" | while read NUM BAR NAME BAR SYMBOL BAR TYPE BAR MASS BAR MP BAR BP
    do 
      echo -e "The element with atomic number $NUM is $NAME ($SYMBOL). It's a $TYPE, with a mass of $MASS amu. $NAME has a melting point of $MP celsius and a boiling point of $BP celsius."
    done
  fi
fi


