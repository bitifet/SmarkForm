#!/bin/bash

SOURCE_FILE="smarkform_logo.pug"
DEST_PATH=".."

# Ensure npx is available
if ! command -v npx &> /dev/null; then
    echo "npx could not be found. Please install Node.js and npm."
    exit 1
fi

# Move to the propper directory
pushd "$(dirname "$0")" 2>/dev/null

# Pring heading
echo "Generating smarkform logo variants:"

# Loop through color and monochrome styles
for palette in "" "_mono"; do
    # Loop through dark and light modes
    for mode in "" "_dark"; do
        # Loop through compact and regular sizes
        for size in "" "_compact"; do
            # Generate the filename based on the current combination
            filename="smarkform${palette}${mode}${size}.svg"
            # Generate the SVG using pug-cli with the appropriate options
            options="{
                compact: $( [ "$size" == "_compact" ] && echo true || echo false ),
                mode: \"$( [ "$mode" == "_dark" ] && echo 'dark' || echo 'light' )\",
                monochrome: $( [ "$palette" == "_mono" ] && echo true || echo false )
            }"
            echo "    → ${filename}"
            npx pug-cli \
              -O "${options}" \
              < ${SOURCE_FILE} \
              > "${DEST_PATH}/$filename"
         done
    done
done


# Return to the original directory
popd 2>/dev/null
