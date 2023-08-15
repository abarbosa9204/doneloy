<?php
    /* vars for export */
    // database record to be exported
    $db_record = $_GET["tabla"];
    // optional where query
    $where = 'WHERE 1 ORDER BY 1';
    // filename for export
    $csv_filename = 'db_export_'.$db_record.'_'.date('Y-m-d').'.csv';
    // database variables
    $hostname = "64.207.153.55";
    $user = "web_iridian";
    $password = "Iridian_$0529@";
    $database = "web_iridian";
    // Database connecten voor alle services
    $mysqli = new  mysqli($hostname, $user, $password,$database);
    $conn = $mysqli;
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $sql_query = "SELECT * FROM ".$db_record;

    // Gets the data from the database
    $result = $conn->query($sql_query);

    $f = fopen('php://temp', 'wt');
    $first = true;
    while ($row = $result->fetch_assoc()) {
        if ($first) {
            fputcsv($f, array_keys($row));
            $first = false;
        }
        fputcsv($f, $row);
    } // end while

    $conn->close();

    $size = ftell($f);
    rewind($f);

    header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
    header("Content-Length: $size");
    // Output to browser with appropriate mime type, you choose ;)
    header("Content-type: text/x-csv");
    header("Content-type: text/csv");
    header("Content-type: application/csv");
    header("Content-Disposition: attachment; filename=$csv_filename");
    fpassthru($f);
    exit;
?>