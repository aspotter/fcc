#! /bin/bash
PSQL="psql -X --username=freecodecamp --dbname=salon --tuples-only -c"

echo -e "\n--- Jack of All Fades - Barbers Shop ---"

MAIN_MENU() {
    if [[ $1 ]]
    then
        echo -e "\n$1\n"
    fi

    # get services
    SERVICES=$($PSQL "SELECT service_id, name FROM services ORDER BY SERVICE_ID")
    echo -e "\nWelcome, which service would you like to book an appointment for?\n"
    echo "$SERVICES" | while read SERVICE_ID BAR NAME
    do 
        echo "$SERVICE_ID) $NAME"
    done

    # read user's choice
    read SERVICE_ID_SELECTED
    
    # check if input is int
    if [[ ! "$SERVICE_ID_SELECTED" =~ ^[0-9]+$ ]]
    then
        MAIN_MENU "\nPlease enter a valid number"
    else 
        SUB_MENU "$SERVICE_ID_SELECTED"
    fi
}

SUB_MENU() {
    SERVICE_RESULT=$($PSQL "SELECT service_id FROM services WHERE service_id=$1")
    # check if service is in list
    if [[ -z $SERVICE_RESULT ]] 
    then
        MAIN_MENU "\nPlease select a valid option from the list."
    else 
        # get phone number 
        echo -e "\nPlease enter your phone number:"
        read CUSTOMER_PHONE
        CUSTOMER_NAME=$($PSQL "SELECT name FROM customers WHERE phone='$CUSTOMER_PHONE'")

        # if name does not exist
        if [[ -z $CUSTOMER_NAME ]]
        then
            # get customer's name
            echo -e "\nPlease enter your name."
            read CUSTOMER_NAME 

            # insert customer into database
            INSERT_CUSTOMER_RESULT=$($PSQL "INSERT INTO customers(phone, name) VALUES('$CUSTOMER_PHONE', '$CUSTOMER_NAME')")
        fi

        # appointment time
        echo -e "\nPlease enter the time you want to book your appointment for, using the format HH:MM DD/MM/YYYY)"
        read SERVICE_TIME

        # get customer_id 
        CUSTOMER_ID=$($PSQL "SELECT customer_id FROM customers WHERE phone='$CUSTOMER_PHONE'")

        # insert into appointments 
        INSERT_APPOINTMENT_RESULT=$($PSQL "INSERT INTO appointments(customer_id, service_id, time) VALUES($CUSTOMER_ID, $1, '$SERVICE_TIME')")

        # confirm appointment for user
        SERVICE_NAME=$($PSQL "SELECT name FROM services WHERE service_id=$1")
        echo -e "\nI have put you down for a $(echo $SERVICE_NAME | sed -E 's/^ *| *$//g') at $SERVICE_TIME, $(echo $CUSTOMER_NAME | sed -E 's/^ *| *$//g')."
    fi
}

MAIN_MENU
