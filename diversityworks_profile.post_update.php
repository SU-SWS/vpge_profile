<?php

/**
 * @file
 * diversityworks_profile.install
 */

/**
 * Disable the core search module.
 */
function diversityworks_profile_post_update_8200() {
  \Drupal::service('module_installer')->uninstall(['search']);
}
