<?php

namespace Drupal\Tests\vpge_profile\Kernel;

use Drupal\KernelTests\KernelTestBase;
use Drupal\layout_builder\Entity\LayoutBuilderEntityViewDisplay;
use Drupal\node\Entity\NodeType;
use Drupal\vpge_profile\VpgeProfilePermissions;

/**
 * Class VpgeProfilePermissionsTest.
 *
 * @group vpge_profile
 * @coversDefaultClass \Drupal\vpge_profile\VpgeProfilePermissions
 */
class StanfordProfilePermissionsTest extends KernelTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'system',
    'node',
    'layout_discovery',
    'layout_builder',
    'layout_library',
    'path_alias',
    'user',
    'field',
  ];

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();
    $this->installSchema('system', ['key_value_expire']);
    $this->installEntitySchema('user');
    $this->installEntitySchema('node');
    $this->installEntitySchema('entity_view_display');

    NodeType::create(['type' => 'article', 'name' => 'Article'])->save();
    /** @var \Drupal\Core\Entity\Display\EntityViewDisplayInterface $display */
    $display = LayoutBuilderEntityViewDisplay::create([
      'targetEntityType' => 'node',
      'bundle' => 'article',
      'mode' => 'default',
      'status' => TRUE,
    ])
      ->enableLayoutBuilder()
      ->setOverridable();
    $display->setThirdPartySetting('layout_library', 'enable', TRUE);
    $display->save();
  }

  /**
   * Test permissions are returned.
   */
  public function testPermissions() {
    $permission_class = VpgeProfilePermissions::create(\Drupal::getContainer());
    $permissions = $permission_class->permissions();
    $this->assertCount(1, $permissions);
    $this->assertArrayHasKey('choose layout for node article', $permissions);
  }

}
