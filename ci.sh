#!/bin/bash
CI=true
npm run test
status=$?
npm run generate-report
exit $status
