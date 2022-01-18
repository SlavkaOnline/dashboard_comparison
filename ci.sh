#!/bin/bash
CI=true
status = npm run test
npm run generate-report
exit $status
