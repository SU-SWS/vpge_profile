<?php

/**
 * @file
 * vpge_profile.install
 */

/**
 * Disable the core search module.
 */
function vpge_profile_post_update_8200(){
  \Drupal::service('module_installer')->uninstall(['search']);
}
