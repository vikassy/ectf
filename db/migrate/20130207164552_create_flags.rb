class CreateFlags < ActiveRecord::Migration
  def change
    create_table :flags do |t|
      t.integer :user_id
      t.string :flag
      t.integer :level

      t.timestamps
    end
  end
end
