class CreateLoads < ActiveRecord::Migration
  def change
    create_table :loads do |t|
      t.boolean :loading

      t.timestamps
    end
  end
end
