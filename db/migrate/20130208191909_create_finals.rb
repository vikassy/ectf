class CreateFinals < ActiveRecord::Migration
  def change
    create_table :finals do |t|
      t.integer :score
      t.integer :user_id

      t.timestamps
    end
  end
end
