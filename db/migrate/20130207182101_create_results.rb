class CreateResults < ActiveRecord::Migration
  def change
    create_table :results do |t|
      t.integer :user_id
      t.integer :level_id
      t.integer :hacked_id
      t.boolean :answer

      t.timestamps
    end
  end
end
