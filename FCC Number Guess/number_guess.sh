#!/bin/bash

PSQL="psql --username=freecodecamp --dbname=number_guess -t --no-align -c"
COUNT=0

GET_USERNAME() {
  # echo message argument passed into function
  if [[ $1 ]] 
  then
    echo -e "\n$1"
  fi

  # username input
  echo "Enter your username: "
  read USERNAME

  if [[ ${#USERNAME} -gt 22 ]]
  then
    GET_USERNAME "Username must be shorter than 22 characters"
  fi

  # get user_id from database
  USER_ID=$($PSQL "SELECT user_id FROM users WHERE username='$USERNAME'")

  if [[ -z $USER_ID ]] 
  then
    # if not in database
    echo -e "\nWelcome, $USERNAME! It looks like this is your first time here."
    INSERT_USER=$($PSQL "INSERT INTO users(username) VALUES('$USERNAME')")
    USER_ID=$($PSQL "SELECT user_id FROM users WHERE username='$USERNAME'")
  else 
    # if user is in database
    USER_GAMES_INFO=$($PSQL "SELECT COUNT(game_id), MIN(guess_count) FROM users INNER JOIN games USING(user_id) WHERE user_id='$USER_ID'")
    echo $USER_GAMES_INFO
    echo "$USER_GAMES_INFO" | while IFS='|' read USER_GAMES_PLAYED USER_BEST_GAME
      do 
        echo -e "\nWelcome back, $USERNAME! You have played $USER_GAMES_PLAYED games, and your best game took $USER_BEST_GAME guesses."
      done
  fi

}

HANDLE_GUESS() {
  # echo message argument passed into function
  if [[ $1 ]] 
  then
    echo -e "\n$1"
  fi

  # guess input from user
  read GUESS

  # check if guess is not an integer
  if [[ $GUESS =~ [^0-9] ]]
  then 
    # restart guess function until an integer is provided
    HANDLE_GUESS "That is not an integer, guess again:"
  else
    # increment guess count
    ((COUNT += 1))

    # compare guess to random number
    if [[ $GUESS -eq $RANDOM_NUMBER ]] 
    then
      # if equal, display guesses and random number
      echo -e "\nYou guessed it in $COUNT tries. The secret number was $RANDOM_NUMBER. Nice job!"

      # update database with user's result
      INSERT_RESULT=$($PSQL "INSERT INTO games(user_id, guess_count) VALUES($USER_ID, $COUNT)")

    elif [[ $GUESS -gt $RANDOM_NUMBER ]]
    then
      # if greater than
      HANDLE_GUESS "It's lower than that, guess again:"
    else
      # if less than
      HANDLE_GUESS "It's higher than that, guess again:"
    fi
  fi
}


GET_USERNAME

# guess number game
# generate random number between 1 and 1000
RANDOM_NUMBER=$(( 1 + RANDOM % (1000 - 1 + 1) ))

echo -e "\nGuess the secret number between 1 and 1000:"

HANDLE_GUESS






