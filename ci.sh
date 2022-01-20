#!/bin/bash
npm run test
status=$?
npm run generate-report
exit $status
