#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Licensed to Cloudera, Inc. under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  Cloudera, Inc. licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from beeswax.design import hql_query
from notebook.sql_utils import strip_trailing_semicolon, split_statements


def test_split_statements():
  assert [''] == hql_query(";;;").statements
  assert ["select * where id == '10'"] == hql_query("select * where id == '10'").statements
  assert ["select * where id == '10'"] == hql_query("select * where id == '10';").statements
  assert ['select', "select * where id == '10;' limit 100"] == hql_query("select; select * where id == '10;' limit 100;").statements
  assert (
    ['select', "select * where id == \"10;\" limit 100"] ==
    hql_query("select; select * where id == \"10;\" limit 100;").statements)
  assert (
    ['select', "select * where id == '\"10;\"\"\"' limit 100"] ==
    hql_query("select; select * where id == '\"10;\"\"\"' limit 100;").statements)


def teststrip_trailing_semicolon():
  # Note that there are two queries (both an execute and an explain) scattered
  # in this file that use semicolons all the way through.

  # Single semicolon
  assert "foo" == strip_trailing_semicolon("foo;\n")
  assert "foo\n" == strip_trailing_semicolon("foo\n;\n\n\n")
  # Multiple semicolons: strip only last one
  assert "fo;o;" == strip_trailing_semicolon("fo;o;;     ")
  # No semicolons
  assert "foo" == strip_trailing_semicolon("foo")

def test_get_hplsql_statements():
  # Not spliting statements at semicolon
  assert (
    "CREATE FUNCTION hello()\n RETURNS STRING\nBEGIN\n RETURN 'Hello, world';\nEND" ==
    split_statements("CREATE FUNCTION hello()\n RETURNS STRING\nBEGIN\n RETURN 'Hello, world';\nEND", 'hplsql')[0][2])

  assert (
    "CREATE FUNCTION hello()\n RETURNS STRING\nBEGIN\n RETURN 'Hello, world';\nEND" !=
    split_statements("CREATE FUNCTION hello()\n RETURNS STRING\nBEGIN\n RETURN 'Hello, world';\nEND")[0][2])
