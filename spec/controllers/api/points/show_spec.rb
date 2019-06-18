require "spec_helper"

describe Api::PointsController do
  include Devise::Test::ControllerHelpers

  describe("#show") do
    let(:user) { FactoryBot.create(:user) }
    let(:device) { user.device }

    it "renders archived points" do
      point = FactoryBot.create(:generic_pointer, device: device)
      point.discard
      sign_in user
      get :show, params: { id: point.id }
      expect(response.status).to eq(200)
      expect(json.fetch(:id)).to eq(point.id)
    end

    it "renders a tool slot" do
      tool_slot = ToolSlot.create!(x: 0,
                                   y: 0,
                                   z: 0,
                                   radius: 0,
                                   device: user.device,
                                   pointer_type: "ToolSlot")
      sign_in user
      payload = { id: tool_slot.id }
      get :show, params: payload
      expect(response.status).to eq(200)
      expect(json[:id]).to eq(tool_slot.id)
      expect(json[:tool_id]).to eq(tool_slot.tool_id)
      expect(json[:name]).to eq(tool_slot.name)
      expect(json[:x]).to eq(tool_slot.x)
      expect(json[:y]).to eq(tool_slot.y)
      expect(json[:z]).to eq(tool_slot.z)
    end
  end
end
